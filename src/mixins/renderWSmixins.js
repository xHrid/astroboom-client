export default {
    methods: {
        rednerWaitinScreen() {

            this.initDimentions()

            const offSet = this.waitingCanvas.getBoundingClientRect();
            const fontSize = this.cWidth > 500 ? 30 : 16;
            this.wctx.font = `${fontSize}px Arial`;
            this.wctx.fillStyle = "rgb(150, 255, 255)";
            this.wctx.fillRect(0, 0, this.cWidth, this.cHeight);
      
            if (!this.matched) {
              this.wctx.fillStyle = "rgb(255, 255, 255)";
              this.wctx.fillRect(0, 0, this.cWidth, this.cHeight / 2);
      
              this.wctx.fillStyle = "rgb(0, 0, 0)";
              this.wctx.fillText(
                `Looking for an opponent`,
                offSet.left,
                offSet.top + this.cHeight / 10,
                this.cWidth
              );
            } else {
              this.wctx.fillStyle = "rgb(100, 255, 100)";
              this.wctx.fillRect(0, 0, this.cWidth, this.cHeight / 2);
      
              this.wctx.fillStyle = "rgb(0, 0, 0)";
              this.wctx.fillText(this.p2Name, offSet.left, offSet.top + this.cHeight / 10, this.cWidth);
            }
      
            this.wctx.fillStyle = "rgb(0, 0, 0)";
            this.wctx.fillText(this.p1Name, this.cWidth / 10, this.cHeight / 1.5);
        },
    }
}