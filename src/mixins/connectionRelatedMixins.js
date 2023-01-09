import blockStates from "@/js/blockStates";
import colorCode from "@/js/colorCode";

export default {
  methods: {
    elegibleToConnect(pixelMap) {
      pixelMap.forEach((cell) => {
        if (cell.status == blockStates.seletected) {
          const dx = [0, 0, 1, -1];
          const dy = [-1, 1, 0, 0];

          for (let p = 0; p < 4; p++) {
            const nx = cell.i + dx[p];
            const ny = cell.j + dy[p];

            if (0 <= nx && nx <= 2 && 0 <= ny && ny <= 1) {
              if (
                pixelMap[nx * 2 + ny].status != blockStates.seletected &&
                pixelMap[nx * 2 + ny].status != blockStates.destroyed
              )
                pixelMap[nx * 2 + ny].status = blockStates.potentialSelect;
            }
          }
        }
      });
    },

    renderConnection(map) {
      map.forEach((b1) => {
        b1.adj.forEach((con) => {
          const b2 = map[con[0] * 2 + con[1]];

          const w = b2.x - b1.x;
          const h = b2.y - b1.y;

          this.ctx.fillStyle = "white";
          this.ctx.fillRect(
            b1.x + b1.w / 2 - 5,
            b1.y + b1.h / 2 - 5,
            w + 10,
            h + 10
          );
        });
      });
    },

    renderPotentialConnection() {
      const c1 = this.activeCells[0];
      const c2 = this.activeCells[1];
      const b1 = this.p1Map[c1.i * 2 + c1.j];
      const b2 = this.p1Map[c2.i * 2 + c2.j];

      const w = b2.x - b1.x;
      const h = b2.y - b1.y;

      this.ctx.fillStyle = colorCode.selected;
      this.ctx.fillRect(
        b1.x + b1.w / 2 - 5,
        b1.y + b1.h / 2 - 5,
        w + 10,
        h + 10
      );
    },
  },
};
