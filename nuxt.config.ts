// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from "./themeconfig/config";

export default defineNuxtConfig({
    ssr: false,
    modules: [
        // "nuxt-electron",
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

    // electron: {
    //     include: ["electron"],
    // },

    unocss: config,
})
