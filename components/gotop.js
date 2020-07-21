export default {
    template: `<div class="go-top" ref="goTop" @click="goTop()">
                    <svg height="42" width="42">
                        <circle cx="21" cy="21" r="20" />
                    </svg>
                    <i class="fas fa-chevron-up"></i>
                </div>`,
    created() {
        window.addEventListener('scroll', this.showGotop);
    },
    methods: {
        showGotop() {
            if (window.pageYOffset > 400) {
                this.$refs.goTop.style.opacity = 1;
            } else {
                this.$refs.goTop.style.opacity = 0;
            }
        },
        goTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        },
    }
};