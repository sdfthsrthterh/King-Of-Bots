import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject {
    constructor(ctx, parent, store) {
        super();

        this.ctx = ctx;
        this.parent = parent;

        this.store = store;

        this.L = 0;  //格子的绝对长度

        this.rows = 13;
        this.cols = 14;
        
        this.inner_walls_count = parseInt(Math.random() * 90); //内部障碍物数量
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#8EC0E4", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#ed317f", r: 1, c: this.cols - 2}, this),
        ];

    }

    

    create_walls() {
        
        const g = this.store.state.pk.gamemap;
        //根据g数组进行画墙
        for(let r = 0;  r < this.rows; r++)
        {
            for(let c = 0; c < this.cols; c++)
            {
                if(g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }


    }

    add_listening_events() {
        if (this.store.state.record.is_record) {
            let k = 0;

            console.log(this.store.state.record);

            const [snake0, snake1] = this.snakes;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k++;
            }, 300);
        } else {
            this.ctx.canvas.focus();
            this.ctx.canvas.addEventListener("keydown", e=> {
                let d = -1;
                if(e.key === 'w') d = 0;
                else if(e.key === 'd') d = 1;
                else if(e.key === 's') d = 2;
                else if(e.key === 'a') d = 3;

                if (d >= 0) {
                    //移动方向合法，则向后端发送移动的请求
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }));
                }
                
            });
        }
    }

    start() {
        this.create_walls();
        this.add_listening_events();
    }

    update_size() {
        //parseInt取整像素点
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {   //判断两条蛇是否都准备好进入下一个回合了 
        for(const snake of this.snakes) {
            if(snake.status !== "idle") return false;
            if(snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {   //让两条蛇进入下一个回合
        for(const snake of this.snakes) {
            snake.next_step();  //调用snake的下一步函数
        }
    }

    check_valid(cell) { //检测目标位置是否合法：没有撞到墙和两条蛇的身体部分
        for (const wall of this.walls) {
            if(wall.r === cell.r && wall.c === cell.c) {
                return false;
            }
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()) {  //如果蛇尾会前进的时候，蛇尾不要判断
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                return false;
            }
        }
        return true;
    }

    update() {
        this.update_size();
        if(this.check_ready()) {  //如果确认两条蛇都准备好了，那么进入下一步
            this.next_step();
        }
        this.render();
    }

    render() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const color_even = "#AAD751", color_odd = "#A2D149";
        for(let r = 0; r < this.rows; r++)
        {
            for(let c = 0; c < this.cols; c++)
            {
                if((c + r) % 2 == 0)
                {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }

    }


}