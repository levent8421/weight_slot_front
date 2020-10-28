export const parseDate = str => {
    const groups = str.match(/^(\d{4})-(\d+)-(\d+)\s(\d+):(\d+):(\d+)$/);
    if (groups) {
        const year = parseInt(groups[1]);
        const month = parseInt(groups[2]);
        const date = parseInt(groups[3]);
        const hour = parseInt(groups[4]);
        const min = parseInt(groups[5]);
        const sec = parseInt(groups[6]);
        const d = new Date();
        d.setFullYear(year);
        d.setMonth(month - 1);
        d.setDate(date);
        d.setHours(hour);
        d.setMinutes(min);
        d.setSeconds(sec);
        return d;
    }
    return false;
};

export const parseTimstamp = str => {
    const date = parseDate(str);
    return date ? date.getTime() : -1;
};
