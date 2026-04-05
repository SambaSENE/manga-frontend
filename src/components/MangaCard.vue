<script>
import { getMangaImageBlob } from "../services/api";

export default {
    name: "MangaCard",
    emits: ["open"],
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
    computed: {
        formattedPrice() {
            const value = Number(this.manga.price);
            if (Number.isNaN(value)) {
                return `${this.manga.price} €`;
            }
            return `${value.toFixed(2)} €`;
        }
    },
    methods: {
        async loadImage() {
            try {
                const blob = await getMangaImageBlob(this.manga.id);
                this.imageSrc = URL.createObjectURL(blob);
            } catch {
                this.imageError = true;
            }
        },
        openCard() {
            this.$emit("open", this.manga);
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
    <article class="card" @click="openCard">
        <div class="card-media">
            <img v-if="imageSrc && !imageError" :src="imageSrc" :alt="manga.title" class="cover" />

            <div v-else class="image-fallback">
                <span>Image indisponible</span>
            </div>

            <div class="media-overlay"></div>
        </div>

        <div class="card-body">
            <div class="card-content">
                <h3>{{ manga.title }}</h3>
                <p class="description">
                    {{ manga.description || "Aucune description disponible." }}
                </p>
            </div>

            <div class="card-footer">
                <div class="price-box">
                    <span class="price-label">Prix</span>
                    <strong class="price">{{ formattedPrice }}</strong>
                </div>

                <button class="details-btn" type="button" @click.stop="openCard">
                    Voir
                </button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 36px rgba(15, 23, 42, 0.11);
    border-color: #cbd5e1;
}

.card-media {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 4.5;
    overflow: hidden;
    background: linear-gradient(180deg, #f8fafc 0%, #e5e7eb 100%);
}

.cover {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.25s ease;
}

.card:hover .cover {
    transform: scale(1.03);
}

.media-overlay {
    position: absolute;
    inset: auto 0 0 0;
    height: 82px;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.30), transparent);
    pointer-events: none;
}

.image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    min-height: 190px;
}

.card-content h3 {
    margin: 0 0 10px;
    font-size: 22px;
    line-height: 1.1;
    color: #0f172a;
}

.description {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 68px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 12px;
}

.price-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.price-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
}

.price {
    font-size: 22px;
    line-height: 1;
    color: #2563eb;
}

.details-btn {
    padding: 8px 12px;
    border-radius: 999px;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    cursor: pointer;
}

@media (max-width: 768px) {
    .card-body {
        min-height: auto;
    }

    .card-content h3 {
        font-size: 20px;
    }

    .price {
        font-size: 20px;
    }
}
</style>