<script>
export default {
    name: "LoginForm",
    data() {
        return {
            username: "",
            password: ""
        };
    },
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
    methods: {
        submitForm() {
            this.$emit("login", {
                username: this.username,
                password: this.password
            });
        }
    }
};
</script>

<template>
    <form @submit.prevent="submitForm" class="form">
        <input v-model.trim="username" type="text" placeholder="Username" autocomplete="username" required />

        <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" required />

        <button type="submit" :disabled="loading">
            {{ loading ? "Connexion..." : "Se connecter" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
    </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

input {
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
</style>