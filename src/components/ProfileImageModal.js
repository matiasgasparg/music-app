import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { updateProfileImage } from "../api"; // Importar la función correcta

function ProfileImageModal({ isOpen, onClose, userId, onUpload }) {
    const { token } = useAuth("state");

    const handleImageUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", event.target.image.files[0]);

        try {
            await updateProfileImage(
                `${import.meta.env.VITE_API_BASE_URL}users/profiles/${userId}/`,
                formData
            );
            onUpload(); // Llamar al método onUpload si es necesario
        } catch (error) {
            console.error("Error updating profile image:", error.message);
        }
    };

    useEffect(() => {
        if (onUpload.profileImageData) {
            onClose();
        }
    }, [onUpload.profileImageData]);

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Subir Imagen de Perfil</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleImageUpload}>
                        <div className="field">
                            <label className="label">Seleccionar Imagen</label>
                            <div className="control">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            className="button is-primary"
                            type="submit"
                            disabled={onUpload.isLoadingUpdate}
                        >
                            {onUpload.isLoadingUpdate ? "Subiendo..." : "Subir"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default ProfileImageModal;
