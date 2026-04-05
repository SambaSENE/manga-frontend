<script>
import { getMangaImageBlob } from "../services/api";

export default {
  name: "MangaDetailModal",
  emits: ["close"],
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
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <p class="section-tag">Détail</p>
          <h2>{{ manga.title }}</h2>
        </div>

        <button class="icon-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="detail-content">
        <div class="detail-image-box">
          <img
            v-if="imageSrc && !imageError"
            :src="imageSrc"
            :alt="manga.title"
            class="detail-image"
          />
          <div v-else class="image-fallback">
            Image indisponible
          </div>
        </div>

        <div class="detail-info">
          <p class="detail-description">
            {{ manga.description || "Aucune description disponible." }}
          </p>

          <div class="detail-price-box">
            <span class="detail-price-label">Prix</span>
            <strong class="detail-price">{{ formattedPrice }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 35;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(6px);
}

.modal-card {
  width: 100%;
  max-width: 920px;
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

.section-tag {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2563eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 30px;
  line-height: 1.05;
  color: #0f172a;
}

.icon-btn {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
}

.detail-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.detail-image-box {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.detail-image {
  width: 100%;
  display: block;
  object-fit: cover;
}

.image-fallback {
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-description {
  margin: 0;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
}

.detail-price-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-price-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.detail-price {
  font-size: 28px;
  color: #2563eb;
}

@media (max-width: 768px) {
  .modal-card {
    padding: 20px;
    border-radius: 22px;
  }

  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>