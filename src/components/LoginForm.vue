<script>
export default {
    name: "LoginForm",
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            username: "",
            password: ""
        };
    },
    methods: {
        submitForm() {
            this.$emit("login", {
                username: this.username.trim(),
                password: this.password
            });
        }
    }
};
</script>

<template>
    <form class="login-form" @submit.prevent="submitForm" novalidate>
        <div class="form-grid">
            <div class="field">
                <label for="username">Nom d’utilisateur</label>
                <input id="username" v-model="username" type="text" name="username"
                    placeholder="Entrez votre nom d’utilisateur" autocomplete="username" required />
            </div>

            <div class="field">
                <label for="password">Mot de passe</label>
                <input id="password" v-model="password" type="password" name="password"
                    placeholder="Entrez votre mot de passe" autocomplete="current-password" required />
            </div>
        </div>

        <div class="form-footer">
            <div class="hint">
                Une authentification est requise pour consulter les mangas et ajouter du contenu.
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Connexion..." : "Se connecter" }}
            </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
    </form>
</template>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.login-form {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

.field {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
}

input {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    height: 54px;
    padding: 0 16px;
    border: 1px solid #dbe3ee;
    border-radius: 14px;
    background: #fff;
    font-size: 15px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

input::placeholder {
    color: #94a3b8;
}

input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10);
    background: #fcfdff;
}

.form-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
}

.hint {
    flex: 1 1 260px;
    min-width: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #64748b;
}

.submit-btn {
    flex: 0 0 auto;
    min-width: 170px;
    max-width: 100%;
    height: 52px;
    padding: 0 18px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.20);
    transition: transform 0.18s ease, opacity 0.18s ease;
}

.submit-btn:hover {
    transform: translateY(-1px);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.error-message {
    width: 100%;
    margin: 0;
    padding: 12px 14px;
    border-radius: 12px;
    background: #fff7f7;
    border: 1px solid #fecaca;
    color: #b91c1c;
    font-size: 14px;
}

@media (max-width: 640px) {
    .form-footer {
        flex-direction: column;
        align-items: stretch;
    }

    .submit-btn {
        width: 100%;
        min-width: 0;
    }
}
</style>