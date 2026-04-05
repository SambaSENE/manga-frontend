<script>
import { login, getMangas, createManga } from "./services/api";
import LoginForm from "./components/LoginForm.vue";
import MangaList from "./components/MangaList.vue";
import UploadForm from "./components/UploadForm.vue";

export default {
  name: "App",
  components: {
    LoginForm,
    MangaList,
    UploadForm
  },
  data() {
    return {
      loading: false,
      error: "",
      user: null,

      mangas: [],
      mangasLoading: false,
      mangasError: "",

      uploadLoading: false,
      uploadError: "",
      uploadSuccess: "",

      showUploadModal: false
    };
  },
  methods: {
    async handleLogin(credentials) {
      this.error = "";
      this.loading = true;

      try {
        const data = await login(credentials.username, credentials.password);

        this.user = data.user;
        await this.loadMangas();
      } catch (err) {
        this.error = err.message || "Erreur de connexion";
      } finally {
        this.loading = false;
      }
    },

    async loadMangas() {
      this.mangasLoading = true;
      this.mangasError = "";

      try {
        const data = await getMangas();
        this.mangas = data.items || [];
      } catch (err) {
        this.mangasError = err.message || "Erreur de chargement des mangas";
      } finally {
        this.mangasLoading = false;
      }
    },

    async handleUpload(formData) {
      this.uploadError = "";
      this.uploadSuccess = "";

      try {
        this.uploadLoading = true;

        const createdManga = await createManga(formData);

        this.uploadSuccess = `Manga créé : ${createdManga.title}`;
        await this.loadMangas();
        this.closeUploadModal();
      } catch (err) {
        this.uploadError = err.message || "Erreur d'upload";
      } finally {
        this.uploadLoading = false;
      }
    },

    handleUploadError(message) {
      this.uploadError = message;
      this.uploadSuccess = "";
    },

    openUploadModal() {
      this.uploadError = "";
      this.uploadSuccess = "";
      this.showUploadModal = true;
    },

    closeUploadModal() {
      this.showUploadModal = false;
      this.uploadError = "";
      this.uploadSuccess = "";
    },

    logout() {
      sessionStorage.clear();
      this.user = null;
      this.mangas = [];
      this.error = "";
      this.mangasError = "";
      this.uploadError = "";
      this.uploadSuccess = "";
      this.showUploadModal = false;
    }
  },
  mounted() {
    //const storedUser = sessionStorage.getItem("user");
    ///const storedToken = sessionStorage.getItem("access_token");

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");
    
    if (storedUser && storedToken) {
      this.user = JSON.parse(storedUser);
      this.loadMangas();
    } else {
      this.logout();
    }
  }
};
</script>

<template>
  <main class="page">
    <section class="card">
      <h1>Manga Collection</h1>

      <LoginForm v-if="!user" :loading="loading" :error="error" @login="handleLogin" />

      <template v-else>
        <div class="topbar">
          <div class="success-box">
            Connecté : <strong>{{ user.username }}</strong> ({{ user.role }})
          </div>

          <div class="actions">
            <button class="upload-btn" @click="openUploadModal">
              Uploader un manga
            </button>

            <button class="logout-btn" @click="logout">
              Se déconnecter
            </button>
          </div>
        </div>

        <MangaList :mangas="mangas" :loading="mangasLoading" :error="mangasError" />
      </template>
    </section>

    <div v-if="user && showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Upload</h2>
          <button class="close-btn" @click="closeUploadModal">✕</button>
        </div>

        <UploadForm :loading="uploadLoading" :error="uploadError" :success="uploadSuccess" @upload="handleUpload"
          @upload-error="handleUploadError" />
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  font-family: Arial, sans-serif;
  padding: 24px 16px;
}

.card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  padding: 28px;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
}

h1 {
  margin: 0 0 24px;
  font-size: 42px;
  line-height: 1.05;
  color: #111827;
}

.topbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.success-box {
  padding: 14px 16px;
  border-radius: 14px;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  font-size: 16px;
}

.upload-btn,
.logout-btn,
.close-btn {
  min-height: 48px;
  border: none;
  border-radius: 14px;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  padding: 0 18px;
  font-size: 15px;
}

.upload-btn {
  background: #2563eb;
}

.logout-btn,
.close-btn {
  background: #111827;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.modal {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
  font-size: 24px;
}

.close-btn {
  width: 44px;
  padding: 0;
}

@media (max-width: 768px) {
  .card {
    padding: 20px;
    border-radius: 20px;
  }

  h1 {
    font-size: 34px;
  }

  .actions {
    flex-direction: column;
  }

  .upload-btn,
  .logout-btn {
    width: 100%;
  }
}
</style>