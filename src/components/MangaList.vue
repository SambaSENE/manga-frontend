<script>
import MangaCard from "./MangaCard.vue";

export default {
    name: "MangaList",
    components: {
        MangaCard
    },
    emits: ["open"],
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
        <div class="section-head">
            <div>
                <p class="section-tag">Bibliothèque</p>
                <h2>Catalogue</h2>
                <p class="subtitle">Parcourez tous les mangas disponibles</p>
            </div>

            <div v-if="mangas.length" class="count-badge">
                {{ mangas.length }} élément<span v-if="mangas.length > 1">s</span>
            </div>
        </div>

        <div v-if="loading" class="state-card">
            <div class="loader"></div>
            <p>Chargement du catalogue...</p>
        </div>

        <div v-else-if="error" class="state-card error-card">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="!mangas.length" class="state-card empty-card">
            <p>Aucun manga trouvé.</p>
        </div>

        <div v-else class="grid">
            <MangaCard v-for="manga in mangas" :key="manga.id" :manga="manga" @open="$emit('open', $event)" />
        </div>
    </section>
</template>

<style scoped>
.manga-list {
    margin-top: 4px;
}

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 16px;
    margin-bottom: 24px;
}

.section-tag {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2563eb;
}

h2 {
    margin: 0;
    font-size: 38px;
    line-height: 1.02;
    color: #0f172a;
}

.subtitle {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 16px;
}

.count-badge {
    flex-shrink: 0;
    padding: 10px 14px;
    border-radius: 999px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-size: 14px;
    font-weight: 700;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 320px));
    gap: 22px;
}

.state-card {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 120px;
    padding: 20px;
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #334155;
}

.error-card {
    border-color: #fecaca;
    background: #fff7f7;
    color: #b91c1c;
}

.empty-card {
    color: #64748b;
}

.loader {
    width: 18px;
    height: 18px;
    border: 3px solid #dbeafe;
    border-top-color: #2563eb;
    border-radius: 999px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 900px) {
    .section-head {
        flex-direction: column;
        align-items: flex-start;
    }

    .grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
}

@media (max-width: 640px) {
    h2 {
        font-size: 30px;
    }

    .subtitle {
        font-size: 15px;
    }

    .grid {
        grid-template-columns: 1fr;
    }
}
</style>