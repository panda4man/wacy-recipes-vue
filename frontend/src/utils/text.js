export const truncate = (text, limit = 100) => {
    return text.length > limit ? text.slice(0, limit) + '...' : text
}