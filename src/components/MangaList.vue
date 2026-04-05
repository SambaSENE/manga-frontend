<script>
import MangaCard from "./MangaCard.vue";

export default {
    name: "MangaList",
    components: {
        MangaCard
    },
    props: {
        mangas: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ""
        }
    }
};
</script>

<template>
    <section class="manga-list">
        <div class="section-header">
            <h2>Catalogue</h2>
            <p class="subtitle">Mangas disponibles</p>
        </div>

        <p v-if="loading" class="state">Chargement...</p>
        <p v-else-if="error" class="state error">{{ error }}</p>
        <p v-else-if="!mangas.length" class="state">Aucun manga trouvé.</p>

        <div v-else class="grid">
            <MangaCard v-for="manga in mangas" :key="manga.id" :manga="manga" />
        </div>
    </section>
</template>

<style scoped>
.manga-list {
    margin-top: 32px;
}

.section-header {
    margin-bottom: 20px;
}

h2 {
    margin: 0;
    font-size: 32px;
    color: #111827;
}

.subtitle {
    margin: 8px 0 0;
    color: #6b7280;
    font-size: 15px;
}

.state {
    margin: 0;
    font-size: 15px;
    color: #374151;
}

.error {
    color: #b91c1c;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
}

@media (max-width: 640px) {
    .grid {
        grid-template-columns: 1fr;
    }

    h2 {
        font-size: 28px;
    }
}
</style>