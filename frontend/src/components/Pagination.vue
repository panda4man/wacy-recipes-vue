<template>
    <div class="mt-2 flex flex-wrap items-center justify-between gap-4">
        <!-- Prev -->
        <button @click="changePage(props.currentPage - 1)" :disabled="props.currentPage <= 1"
            class="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50">
            ← Prev
        </button>

        <!-- Page Numbers and Extras -->
        <div class="flex items-center space-x-1">
            <!-- First -->
            <button v-if="props.paginationRange[0] > 1" @click="changePage(1)"
                class="px-3 py-1 bg-white dark:bg-gray-700 border rounded">
                1
            </button>

            <!-- Ellipsis before -->
            <span v-if="props.paginationRange[0] > 2" class="px-2">…</span>

            <!-- Page Numbers -->
            <button v-for="page in props.paginationRange" :key="page" @click="changePage(page)" :class="[
                'px-3 py-1 rounded border',
                page === props.currentPage
                    ? 'bg-alaska-gold text-black font-bold'
                    : 'bg-white dark:bg-gray-700',
            ]">
                {{ page }}
            </button>

            <!-- Ellipsis after -->
            <span
                v-if="props.paginationRange[props.paginationRange.length - 1] < props.lastPage - 1"
                class="px-2">…</span>

            <!-- Last -->
            <button
                v-if="props.paginationRange[props.paginationRange.length - 1] < props.lastPage"
                @click="changePage(props.lastPage)"
                class="px-3 py-1 bg-white dark:bg-gray-700 border rounded">
                {{ props.lastPage }}
            </button>
        </div>

        <!-- Next -->
        <button @click="changePage(props.currentPage + 1)"
            :disabled="props.currentPage >= props.lastPage"
            class="px-3 py-1 bg-blue-900 text-white rounded disabled:opacity-50">
            Next →
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    paginationRange: {
        type: Array,
        required: true,
    },
    lastPage: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['changePage'])

const changePage = (page) => {
    emit('changePage', page)
}
</script>