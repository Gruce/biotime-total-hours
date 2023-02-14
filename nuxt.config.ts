// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from "./app/themeconfig/config";

export default defineNuxtConfig({
    srcDir: "app/",

    ssr: false,

    modules: [
        "nuxt-icon",
        "nuxt-headlessui",
        "@unocss/nuxt",
        "@vueuse/nuxt",
        "@pinia/nuxt",
        "@nuxtjs/color-mode",
    ],

    unocss: config,
})
