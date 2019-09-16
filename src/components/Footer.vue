<template>
    <v-footer 
     class="title"
     bottom
     absolute>
        <v-col
         class="text-center"
         cols="12"
        >
            {{ new Date().getFullYear() }} — <strong>sawara</strong>
        </v-col>
    </v-footer>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    created: function() {
    }
};
</script>