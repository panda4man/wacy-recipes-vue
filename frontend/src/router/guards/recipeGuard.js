export const recipeGuard = (to, from, next) => {
    const slug = to.params.slug

    if (!slug || slug === 'undefined' || slug === 'null') {
        next({ name: 'not-found' })
    } else {
        next()
    }
}