import socketio from "socket.io-client";
import config from "@/config";
import emitNames from "@/js/emitNames";

export default {
  methods: {
    socketinit() {
      this.socket = socketio(`${config.SERVER_BASEURL}`);
      this.socket.emit(
        emitNames.handshake,
        this.p1Name,
        this.lobbyCode,
        this.mode,
        this.p1Email
      );
      
      this.socket.on(emitNames.p2Details, (obj) => {
        this.matched = true;
        this.p2Name = obj.p2;
        this.p1Map = obj.p1Data;
        this.p2Map = obj.p2Data;
        this.yourTurn = obj.yourTurn;
        this.playerPostion = JSON.parse(JSON.stringify(obj.position));
        console.log(this.playerPostion);
        setTimeout(() => (this.start = true), 2000);
      });

      this.socket.on(emitNames.p2Disconnected, () => {
        console.log("P2 Disconnected");
        this.start = false;
        this.matched = false;
      });

      this.socket.on(emitNames.upDateState, (p1Data, p2Data, yourTurn, attackData, canNotBuild, gameOver) => {

        if (attackData[0] === null){
          if (p1Data) {
            (this.p1Map = JSON.parse(JSON.stringify(p1Data))),
              this.arrayMapToPixelMap(this.p1Map, 100, 100);
          }

          if (p2Data) {
            (this.p2Map = JSON.parse(JSON.stringify(p2Data))),
              this.arrayMapToPixelMap(this.p2Map, 600, 100);
          }

          this.yourTurn = yourTurn;

          
        } else {
          
          if (attackData[1]) {
            this.lastAttackedSquare = {
              x: this.p1Map[attackData[0]].x + this.rect.left - this.homeSize*0.1,
              y: this.p1Map[attackData[0]].y + this.rect.top - this.homeSize*0.2,
            }
          } else {
            this.lastAttackedSquare = {
              x: this.p2Map[attackData[0]].x + this.rect.left - this.homeSize*0.1,
              y: this.p2Map[attackData[0]].y + this.rect.top - this.homeSize*0.2,
            }

          }

          this.asteroidAcceleration = this.lastAttackedSquare.y / 200;

          this.afterAttackAnimationData = {
            p1Data,
            p2Data,
            yourTurn,
            gameOver,
          }

          this.explosionJ = 0;
          this.explosionX = this.lastAttackedSquare.x;
          this.explosionY = this.lastAttackedSquare.y;
          this.explosionW = this.homeSize;
          this.explosionH = this.homeSize;

          this.animateAttack();

          if (gameOver[0]) {
            this.gameEnded = gameOver[0]
            if (gameOver[1]) this.endText = "You Won!"
            else this.endText = "Better Luck next Time"

          }
          
          this.resetMapStatus(this.p1Map);
          this.resetMapStatus(this.p2Map);
          
        }

        this.canNotBuild = canNotBuild;

        this.moveSelected = null;
        this.validMove = false;
      });

      this.socket.on(emitNames.updateP2, p2 => {
        this.p2Position = {
          ...p2,
        };

        // this.lastAttackedSquare = {
        //   x: this.p1Map[attackedSquare].x + this.rect.left,
        //   y: this.p1Map[attackedSquare].y + this.rect.top
        // }

        // this.animateAttack();

      });
    },
  },
};
