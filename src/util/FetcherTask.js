class FetcherTask {
    constructor(config) {
        const {fetchData, onNewData, duration, onError} = config;
        this.fetchData = fetchData;
        this.onNewData = onNewData;
        this.duration = duration;
        this.onError = onError;
        this.running = true;
    }

    start() {
        this.fetchData()
            .then(res => {
                this.onNewData(res);
                this.runNext();
            })
            .catch(err => {
                this.onError(err);
                this.runNext();
            });
    }

    runNext() {
        if (!this.running) {
            return;
        }
        this.timmer = setTimeout(() => {
            this.start();
        }, this.duration);
    }

    stop() {
        this.running = false;
        if (this.timmer) {
            clearTimeout(this.timmer);
        }
    }
}

export default FetcherTask;
