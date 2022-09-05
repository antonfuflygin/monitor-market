function getId() {
    const entries = new Map(document.cookie.split(';')
        .map(c => c.trim().split('=')));

    return Object.fromEntries(entries)['x-supplier-id'];
}

export default getId()