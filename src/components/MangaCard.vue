<script>
import { getMangaImageBlob } from "../services/api";

export default {
    name: "MangaCard",
    props: {
        manga: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            imageSrc: "",
            imageError: false
        };
    },
    methods: {
        async loadImage() {
            try {
                const blob = await getMangaImageBlob(this.manga.id);
                this.imageSrc = URL.createObjectURL(blob);
            } catch {
                this.imageError = true;
            }
        }
    },
    mounted() {
        this.loadImage();
    },
    beforeUnmount() {
        if (this.imageSrc) {
            URL.revokeObjectURL(this.imageSrc);
        }
    }
};
</script>

<template>
    <article class="card">
        <div class="image-wrapper">
            <img v-if="imageSrc && !imageError" :src="imageSrc" :alt="manga.title" class="cover" />
            <div v-else class="image-placeholder">
                Image indisponible
            </div>
        </div>

        <div class="content">
            <h3>{{ manga.title }}</h3>
            <p class="description">
                {{ manga.description || "Aucune description disponible." }}
            </p>
            <p class="price">{{ manga.price }} €</p>
        </div>
    </article>
</template>

<style scoped>
.card {
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
}

.image-wrapper {
    width: 100%;
    aspect-ratio: 4 / 5;
    background: #f3f4f6;
    overflow: hidden;
}

.cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 14px;
    background: #f3f4f6;
}

.content {
    padding: 18px;
}

h3 {
    margin: 0 0 10px;
    font-size: 22px;
    color: #111827;
}

.description {
    margin: 0 0 16px;
    color: #4b5563;
    font-size: 14px;
    line-height: 1.5;
}

.price {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #2563eb;
}
</style>