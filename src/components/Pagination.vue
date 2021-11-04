<template>
    <div class="">
        <ul v-if="pages" class="space-x-2 list-reset">
            <!-- <li class="inline-block mr-1 bg-white border hover:bg-blue-lightest">
                <button class="block px-4 py-3 no-underline text-grey-darker"
                   :class="{'bg-grey-lightest text-grey cursor-not-allowed': currentPage == 1}"
                   @click.prevent="getPreviousPage">Previous</button>
            </li> -->
            <li v-for="(page, index) in range"
                :key="index"
                class="inline-block font-semibold "
                :class="{'border-r-null': index == range.length -1}"
            >
                <button v-if="page != '...'"
                   class="inline-block px-4 py-3 font-semibold no-underline bg-white rounded-lg shadow hover:bg-red-600 hover:text-white"
                   :class="{'text-white bg-red-600 hover:bg-red-700' : page == currentPage}"
                   @click.prevent="getPage(page)">
                    {{page}}
                </button>
                <button v-else class="block px-4 py-3 no-underline cursor-default text-grey-darker">
                    {{page}}
                </button>
            </li>
            <!-- <li class="inline-block ml-1 bg-white border hover:bg-blue-lightest">
                <button class="block px-4 py-3 no-underline text-grey-darker"
                   :class="{'bg-grey-lightest text-grey cursor-not-allowed': currentPage >= pages}"
                   @click.prevent="getNextPage">Next</button>
            </li> -->
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Pagination',
        props: {
            pages: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 1
            },
            filler: {
                type: Number,
                default: 10
            }
        },
        data() {
            return {
                range: []
            }
        },
        computed: {
            propsToWatch() {
                return this.pages, this.currentPage, Date.now()
            }
        },
        watch: {
            propsToWatch: {
                handler: 'organisePageLinks',
                immediate: true
            }
        },
        methods: {
            organisePageLinks() {
                this.range = []
                for (let i = 1; i <= this.pages; i++) {
                    if (
                        i == 1 || // first page
                        i == this.pages || // last page
                        i == this.currentPage || // current page
                        i == this.currentPage - 1 || // page before current
                        i == this.currentPage + 1 || // page after current
                        (i <= this.filler && this.currentPage < this.filler) || // "filler" links at start
                        (i >= this.pages - this.filler -1 && this.currentPage > this.pages - this.filler-1) // "filler" links at end
                    ) {
                        let index = this.range.length
                        if (index > 0 && this.range[index - 1] < i - 1) {
                            // if this page is not the next one insequence, add in 3 dots "..."
                            this.range.push('...')
                        }
                        this.range.push(i)
                    }
                }
            },
            getPage(page) {
                this.$emit('page-changed', page)
            },
            getPreviousPage() {
                this.getPage(this.currentPage - 1)
            },
            getNextPage() {
                this.getPage(this.currentPage + 1)
            }
        }
    }
</script>