class Statistics {
    data: {time: string, value: number}[];
    from: string;
    to: string;

    constructor(data: {time: string, value: number}[]) {
        this.data = data;
        this.from = data.length > 0 ? data[0].time : '';
        this.to = data.length > 0 ? data[data.length - 1].time : '';
    }
}

export { Statistics };