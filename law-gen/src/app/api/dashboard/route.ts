const completedChapters = readingProgress.filter(rp => rp.completed).length +
                              watchHistory.filter(wh => wh.completed).length
=======
    // Calculate stats
    const completedChapters = readingProgress.filter((rp: any) => rp.completed).length +
                              watchHistory.filter((wh: any) => wh.completed).length
