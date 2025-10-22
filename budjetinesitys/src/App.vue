<template>
  <div id="app">
    <nav class="main-navigation">
      <div class="nav-container">
        <div class="nav-brand">
          <h1 class="nav-title">Budjetti</h1>
        </div>
        <button 
          class="nav-toggle" 
          @click="toggleMenu"
          :class="{ 'active': isMenuOpen }"
          aria-label="Toggle navigation menu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        <div class="nav-links" :class="{ 'nav-open': isMenuOpen }">
          <router-link to="/" @click="closeMenu">Koti</router-link>
          <router-link to="/overview" @click="closeMenu">Budjetin yleiskuva</router-link>
          <router-link to="/economic-indicators" @click="closeMenu">Taloudelliset indikaattorit</router-link>
          <router-link to="/public-sector" @click="closeMenu">Julkinen sektori</router-link>
          <router-link to="/debt-analysis" @click="closeMenu">Velkaanalyysi</router-link>
          <router-link to="/data-visualization" @click="closeMenu">Datan näyttö</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
</script>

<style>
.main-navigation {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.nav-brand {
  flex-shrink: 0;
}

.nav-title {
  margin: 0;
  font-size: 1.5rem;
  color: #495057;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.nav-toggle:hover {
  background-color: #e9ecef;
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #495057;
  margin: 3px 0;
  transition: all 0.3s;
}

.nav-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 5px);
}

.nav-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -5px);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #495057;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.nav-links a:hover {
  background-color: #e9ecef;
}

.nav-links a.router-link-active {
  background-color: #6c757d;
  color: white;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    flex-direction: column;
    padding: 1rem;
    gap: 0.25rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links a {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
  }
  
  .nav-container {
    padding: 0 0.75rem;
  }
}
</style>