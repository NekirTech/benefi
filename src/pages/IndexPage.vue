<template>
  <div class="home">
    <div class="wrap">
      <figure class="photo">
        <img
          src="/coffee.jpg"
          alt="Benefi Café – latte art"
          width="720"
          height="604"
          fetchpriority="high"
        />
      </figure>

      <section class="intro">
        <p class="eyebrow">{{ text.tagline }}</p>
        <h1>Benefi Café</h1>
        <p class="lead">{{ text.enjoy }}</p>
        <router-link to="/menu" class="cta">
          {{ text.toMenu }}
          <span aria-hidden="true">→</span>
        </router-link>
      </section>

      <section>
        <h2>{{ text.opening }}</h2>
        <table class="hours">
          <tbody>
            <tr
              v-for="(day, index) in text.days"
              :key="day"
              :class="{ today: index === todayIndex }"
            >
              <th scope="row">
                {{ day }}
                <span v-if="index === todayIndex" class="badge">{{
                  text.today
                }}</span>
              </th>
              <td>{{ formatHours(site.hours[index]) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>{{ text.location }}</h2>
        <address>
          {{ site.street }}<br />
          {{ site.postcode }} {{ site.city }}/{{ site.region }}
        </address>
        <p class="muted">{{ text.located }}</p>
        <a :href="site.maps" target="_blank" rel="noopener" class="text-link">
          {{ text.directions }}
        </a>
      </section>

      <section>
        <h2>{{ text.contact }}</h2>
        <ul class="contact">
          <li>
            <a :href="`tel:${site.phone.replace(/\s/g, '')}`">{{
              site.phone
            }}</a>
          </li>
          <li>
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLocale } from 'src/composables/useLocale';
import { site } from 'src/site';

const { text } = useLocale();

// Monday = 0. Set in the browser only, the prerendered page has no "today".
const todayIndex = ref(-1);
onMounted(() => {
  todayIndex.value = (new Date().getDay() + 6) % 7;
});

// "08:00" – "24:00" -> "08 – 24"
function formatHours([opens, closes]: readonly [string, string]) {
  return [opens, closes].map((t) => t.replace(/:00$/, '')).join(' – ');
}
</script>

<style scoped>
.photo {
  margin: 0.5rem 0 0;
}

.photo img {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 4px;
}

section {
  padding-block: 2.25rem;
  border-bottom: 1px solid var(--line);
}

section:last-child {
  border-bottom: 0;
}

.intro {
  padding-top: 1.75rem;
}

.intro h1 {
  margin-top: 0.35rem;
  font-size: clamp(2.5rem, 11vw, 3.5rem);
}

.lead {
  margin-top: 0.85rem;
  max-width: 32rem;
  font-size: 1.125rem;
  color: var(--ink-soft);
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.75rem;
  padding: 1rem 1.25rem;
  background: var(--ink);
  color: var(--paper);
  border-radius: 6px;
  font-weight: 500;
  font-size: 1.125rem;
  text-decoration: none;
}

.cta:hover span {
  transform: translateX(3px);
}

.cta span {
  transition: transform 0.15s;
}

h2 {
  font-size: 1.625rem;
  margin-bottom: 1rem;
}

.hours {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

.hours th,
.hours td {
  padding: 0.45rem 0;
  border-bottom: 1px dashed var(--line);
  text-align: left;
  font-weight: 400;
}

.hours td {
  text-align: right;
}

.hours tr:last-child th,
.hours tr:last-child td {
  border-bottom: 0;
}

.hours .today th,
.hours .today td {
  font-weight: 600;
}

.badge {
  margin-left: 0.4rem;
  padding: 0.05rem 0.45rem;
  border-radius: 3px;
  background: var(--mint-wash);
  color: var(--mint-ink);
  font-size: 0.75rem;
  font-weight: 600;
}

address {
  font-style: normal;
}

.muted {
  margin-top: 0.5rem;
  color: var(--ink-soft);
}

.text-link,
.contact a {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--mint-ink);
  font-weight: 500;
  text-underline-offset: 0.2em;
}

.contact {
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact a {
  margin-top: 0.25rem;
}
</style>
