<script>
import { login, getMangas, createManga } from "./services/api";
import LoginForm from "./components/LoginForm.vue";
import MangaList from "./components/MangaList.vue";
import UploadForm from "./components/UploadForm.vue";
import MangaDetailModal from "./components/MangaDetailModal.vue";

export default {
  name: "App",
  components: {
    LoginForm,
    MangaList,
    UploadForm,
    MangaDetailModal
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

      showUploadModal: false,
      selectedManga: null
    };
  },
  methods: {
    async handleLogin(credentials) {
      this.error = "";
      this.loading = true;

      try {
        const data = await login(credentials.username, credentials.password);

        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("refresh_token", data.refresh_token);
        sessionStorage.setItem("access_expires_at", data.access_expires_at);
        sessionStorage.setItem("refresh_expires_at", data.refresh_expires_at);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        this.user = data.user;
        await this.loadMangas();
      } catch (err) {
        this.error = err.message || "Échec de connexion";
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
        this.mangasError = err.message || "Impossible de charger les mangas";
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
        this.uploadError = err.message || "Échec de l'upload";
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

    openMangaModal(manga) {
      this.selectedManga = manga;
    },

    closeMangaModal() {
      this.selectedManga = null;
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
      this.selectedManga = null;
    }
  },
  mounted() {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("access_token");

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
  <main class="page-shell">
    <div class="bg-blur blur-1"></div>
    <div class="bg-blur blur-2"></div>
    <div class="bg-grid"></div>

    <section :class="['app-frame', { 'app-frame--auth': !user }]">
      <header :class="['hero', { 'hero--auth': !user }]">
        <div class="hero-badge">Plateforme Manga Collection</div>
        <div class="hero-metrics" v-if="user">
          <div class="metric-card">
            <span class="metric-label">Utilisateur</span>
            <strong>{{ user.username }}</strong>
          </div>

          <div class="metric-card">
            <span class="metric-label">Rôle</span>
            <strong>{{ user.role }}</strong>
          </div>

          <div class="metric-card">
            <span class="metric-label">Catalogue</span>
            <strong>{{ mangas.length }}</strong>
          </div>
        </div>
      </header>

      <section v-if="!user" class="auth-center">
        <section class="panel login-panel">
          <div class="panel-head panel-head--auth">
            <div>
              <p class="section-tag">Authentification</p>
              <h2>Connexion</h2>
              <p class="section-text">
                Accédez à votre catalogue protégé et aux fonctions d’upload.
              </p>
            </div>
          </div>

          <LoginForm :loading="loading" :error="error" @login="handleLogin" />
        </section>
      </section>

      <template v-else>
        <section class="toolbar">
          <div class="status-box">
            <span class="status-dot"></span>
            Connecté en tant que <strong>{{ user.username }}</strong>
          </div>

          <div class="toolbar-actions">
            <button class="btn btn-primary" @click="openUploadModal">
              Uploader un manga
            </button>

            <button class="btn btn-secondary" @click="logout">
              Déconnexion
            </button>
          </div>
        </section>

        <section class="panel content-panel">
          <div class="panel-head">
            <div>
              <p class="section-tag">Bibliothèque</p>
              <h2>Catalogue</h2>
            </div>
          </div>

          <MangaList :mangas="mangas" :loading="mangasLoading" :error="mangasError" @open="openMangaModal" />
        </section>
      </template>
    </section>

    <div v-if="user && showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <p class="section-tag">Création</p>
            <h2>Nouveau manga</h2>
            <p class="section-text">
              Ajoutez un manga avec image, titre, description et prix.
            </p>
          </div>

          <button class="icon-btn" @click="closeUploadModal">✕</button>
        </div>

        <UploadForm :loading="uploadLoading" :error="uploadError" :success="uploadSuccess" @upload="handleUpload"
          @upload-error="handleUploadError" />
      </div>
    </div>

    <MangaDetailModal v-if="selectedManga" :manga="selectedManga" @close="closeMangaModal" />
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page-shell {
  position: relative;
  min-height: 100vh;
  padding: 36px 18px;
  overflow: hidden;
  font-family: Inter, Arial, sans-serif;
  background:
    linear-gradient(180deg, #020617 0%, #0f172a 45%, #111827 100%);
}

.bg-blur {
  position: absolute;
  border-radius: 999px;
  filter: blur(110px);
  opacity: 0.25;
  pointer-events: none;
}

.blur-1 {
  top: 0;
  left: -120px;
  width: 320px;
  height: 320px;
  background: #2563eb;
}

.blur-2 {
  bottom: 30px;
  right: -90px;
  width: 340px;
  height: 340px;
  background: #06b6d4;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), transparent 92%);
  pointer-events: none;
}

.app-frame {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.app-frame--auth {
  max-width: 1100px;
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero {
  margin-bottom: 26px;
  padding: 34px;
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.94) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(10px);
}

.hero--auth {
  max-width: 860px;
  margin: 0 auto 28px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 920px;
  font-size: 52px;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.hero--auth h1 {
  margin: 0 auto;
  max-width: 760px;
}

.hero-text {
  margin: 16px 0 0;
  max-width: 760px;
  font-size: 17px;
  line-height: 1.75;
  color: #475569;
}

.hero--auth .hero-text {
  margin: 16px auto 0;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 180px));
  gap: 14px;
  margin-top: 24px;
}

.metric-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.metric-label {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.metric-card strong {
  font-size: 22px;
  color: #0f172a;
}

.auth-center {
  display: flex;
  justify-content: center;
}

.panel {
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.login-panel {
  width: 100%;
  max-width: 640px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.panel-head--auth {
  justify-content: center;
  text-align: center;
}

.section-tag {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2563eb;
}

.panel-head h2,
.modal-header h2 {
  margin: 0;
  font-size: 30px;
  line-height: 1.05;
  color: #0f172a;
}

.section-text {
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
}

.status-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 15px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  font-size: 14px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn,
.icon-btn {
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.btn:hover,
.icon-btn:hover {
  transform: translateY(-1px);
}

.btn {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 14px;
}

.btn-primary {
  color: #ffffff;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
}

.btn-secondary {
  color: #ffffff;
  background: #111827;
}

.content-panel {
  padding: 28px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(2, 6, 23, 0.68);
  backdrop-filter: blur(6px);
}

.modal-card {
  width: 100%;
  max-width: 660px;
  padding: 26px;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.icon-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 18px;
}

@media (max-width: 980px) {
  h1 {
    font-size: 42px;
  }

  .hero-metrics {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 20px 12px;
  }

  .hero,
  .panel,
  .content-panel,
  .modal-card {
    padding: 20px;
    border-radius: 22px;
  }

  h1 {
    font-size: 34px;
  }

  .hero-text {
    font-size: 15px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>