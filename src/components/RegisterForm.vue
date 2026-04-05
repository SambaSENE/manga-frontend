<script>
export default {
    name: "RegisterForm",
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
            username: "",
            password: "",
            role: "user"
        };
    },
    methods: {
        submitForm() {
            this.$emit("register", {
                username: this.username,
                password: this.password,
                role: this.role
            });
        },
        resetForm() {
            this.username = "";
            this.password = "";
            this.role = "user";
        }
    },
    watch: {
        success(newValue) {
            if (newValue) {
                this.resetForm();
            }
        }
    }
};
</script>

<template>
    <form @submit.prevent="submitForm" class="form">
        <h2>Créer un utilisateur</h2>

        <input v-model.trim="username" type="text" placeholder="Nouveau username" autocomplete="off" required />

        <input v-model="password" type="password" placeholder="Mot de passe" autocomplete="new-password" required />

        <select v-model="role" required>
            <option value="user">user</option>
            <option value="admin">admin</option>
        </select>

        <button type="submit" :disabled="loading">
            {{ loading ? "Création..." : "Créer l'utilisateur" }}
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
select {
    height: 44px;
    padding: 0 12px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
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