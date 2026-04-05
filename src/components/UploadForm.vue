<script>
export default {
    name: "UploadForm",
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ""
        },
        success: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            selectedFileName: ""
        };
    },
    methods: {
        handleFileChange(event) {
            const file =
                event.target.files && event.target.files[0]
                    ? event.target.files[0]
                    : null;

            this.selectedFileName = file ? file.name : "";
        },

        submitForm() {
            const form = this.$refs.uploadForm;
            const formData = new FormData(form);
            const image = formData.get("image");

            const hasValidImage =
                image &&
                typeof image === "object" &&
                "name" in image &&
                "size" in image &&
                image.name &&
                image.size > 0;

            if (!hasValidImage) {
                this.$emit("upload-error", "Image obligatoire");
                return;
            }

            this.$emit("upload", formData);
        },

        resetForm() {
            this.selectedFileName = "";

            if (this.$refs.uploadForm) {
                this.$refs.uploadForm.reset();
            }
        }
    },
    watch: {
        success(value) {
            if (value) {
                this.resetForm();
            }
        }
    }
};
</script>

<template>
    <form ref="uploadForm" class="form" enctype="multipart/form-data" @submit.prevent="submitForm">
        <h2>Uploader un manga</h2>

        <input name="title" type="text" placeholder="Titre" required />

        <textarea name="description" placeholder="Description" rows="4" />

        <input name="price" type="text" placeholder="Prix ex: 7.90" required />

        <div class="file-field">
            <input id="manga-image" name="image" type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" @change="handleFileChange" required />
            <label for="manga-image" class="file-label">Choisir un fichier</label>
            <span class="file-name">
                {{ selectedFileName || "Aucun fichier sélectionné" }}
            </span>
        </div>

        <button type="submit" :disabled="loading">
            {{ loading ? "Upload..." : "Créer le manga" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
    </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

h2 {
    margin: 0 0 8px;
    font-size: 20px;
    color: #111827;
}

input,
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
}

.file-field {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    flex-wrap: wrap;
}

.file-field input[type="file"] {
    display: none;
}

.file-label {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 14px;
}

.file-name {
    font-size: 14px;
    color: #374151;
    word-break: break-all;
}

button {
    height: 44px;
    border: none;
    border-radius: 10px;
    background: #2563eb;
    color: white;
    font-weight: 700;
    cursor: pointer;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error {
    margin: 0;
    color: #b91c1c;
    font-size: 14px;
}

.success {
    margin: 0;
    color: #15803d;
    font-size: 14px;
}
</style>