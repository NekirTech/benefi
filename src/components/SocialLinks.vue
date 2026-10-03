<template>
  <ul class="social">
    <li>
      <a
        href="https://www.instagram.com/benefi_cafe/"
        target="_blank"
        rel="noopener"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
        </svg>
        <span>benefi_cafe</span>
      </a>
    </li>
    <li>
      <a
        href="https://www.tiktok.com/@benefi.cafe"
        target="_blank"
        rel="noopener"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6"
          />
        </svg>
        <span>benefi.cafe</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.25rem;
  text-decoration: none;
}

a:hover span {
  text-decoration: underline;
}

svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
