// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from "./app/themeconfig/config";

export default defineNuxtConfig({
    srcDir: "app/",

    modules: [
        "nuxt-icon",
        "nuxt-headlessui",
        "@unocss/nuxt",
        "@vueuse/nuxt",
        "@pinia/nuxt",
        "@nuxtjs/color-mode",
    ],

    runtimeConfig: {
        public: {
            hoursCut: 7,
            excludeNames: ["Ajjour", "Admin"],
        }
    },

    unocss: config,
})
