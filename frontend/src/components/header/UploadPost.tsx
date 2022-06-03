import { ChangeEvent, useState, memo, useEffect, FormEvent } from "react";
import Modal from "react-modal";
import { BiImageAdd } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PostThunk from "../../redux/post/thunk";
// import { axiosFormData } from "../../configs/axiosConfig";

import "./header.css";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        maxHeight: "80vh",
    },
};

Modal.setAppElement("#root");

interface Props {
    modalIsOpen: boolean;
    closeModal: any;
}

function UploadPost({ modalIsOpen, closeModal }: Props) {
    const [arrayImage, setArrayImage] = useState<Array<File>>([]);
    const userState = useAppSelector((state) => state.user);
    const [reload, setReload] = useState(false);

    const uploadMultipleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files as FileList;

        for (let i = 0; i < fileList.length; i++) {
            setArrayImage((prev) => {
                return [...prev, fileList[i]];
            });
        }
    };

    useEffect(() => {
        if (!modalIsOpen) {
            setArrayImage([]);
        }
    }, [modalIsOpen]);

    const removeImage = (_id: number) => {
        setArrayImage((prev) => {
            const cur_state = [...prev];
            cur_state.splice(_id, 1);
            return cur_state;
        });
    };

    const dispatch = useAppDispatch();
    const handleSubmitPost = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("author", userState.user.username);
        formData.append(
            "content",
            (document.querySelector("#content") as HTMLInputElement).value
        );
        for (const img of arrayImage) {
            formData.append("images", img, img.name);
        }
        dispatch(
            PostThunk.addPost()({
                _data: formData,
                access_token: userState.access_token,
            })
        );
        setReload(true);
    };

    return (
        <div>
            {reload ? (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 className="title_upload">Post Success</h2>
                    <button
                        className="reload"
                        onClick={() => window.location.reload()}
                    >
                        Oke
                    </button>
                </Modal>
            ) : (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 className="title_upload">Upload your post</h2>
                    <div className="imageContain">
                        {arrayImage.map((img, index) => {
                            return (
                                <div key={index} className="imageItem">
                                    <TiDelete
                                        id={"delete_" + index}
                                        onClick={() => removeImage(index)}
                                    />
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt=""
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <form onSubmit={(e) => handleSubmitPost(e)}>
                        <div>
                            <textarea
                                placeholder="Your content"
                                id="content"
                                spellCheck="false"
                            ></textarea>
                        </div>
                        <div>
                            <label
                                htmlFor="uploadBtn"
                                style={{ cursor: "pointer" }}
                            >
                                <BiImageAdd fontSize={30} />
                            </label>

                            <input
                                type="file"
                                onChange={(e) => uploadMultipleFile(e)}
                                multiple
                                hidden
                                id="uploadBtn"
                            />
                        </div>
                        <button className="submit_post">Post</button>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default memo(UploadPost);
