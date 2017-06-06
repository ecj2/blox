class Block {

  constructor() {

    this.x = 0;
    this.y = 0;

    this.x_saved = 0;
    this.y_saved = 0;

    this.speed = 6;

    this.moving = false;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.move = [false, false, false, false];

    this.resting_on_goal = false;

    this.pushable = [false, false, false, false];

    this.play_sound = true;
  }

  save() {

    this.x_saved = this.x;
    this.y_saved = this.y;
  }

  restore() {

    Objects.setTile(parseInt(this.x / tile_w), parseInt(this.y / tile_h), "00x00n");

    this.x = this.x_saved;
    this.y = this.y_saved;

    this.moving = false;

    this.start_tile = -1;
    this.stop_tile = -1;

    this.move = [false, false, false, false];

    this.resting_on_goal = false;
  }

  update() {

    if (this.moving) {

      if (this.play_sound) {

        this.play_sound = false;

        Momo.playSound(sound_push, 0.35, 1.0, false);
      }
    }

    if (!this.moving) {

      this.play_sound = true;

      // Set the tile that the block occupies to solid.
      Objects.setTile(this.x / tile_w, this.y / tile_h, "04x00y");

      if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h - 1) == "y") {

        this.pushable[UP] = false;
      }
      else {

        this.pushable[UP] = true;
      }

      if (Objects.getTileFlag(this.x / tile_w, this.y / tile_h + 1) == "y") {

        this.pushable[DOWN] = false;
      }
      else {

        this.pushable[DOWN] = true;
      }

      if (Objects.getTileFlag(this.x / tile_w - 1, this.y / tile_h) == "y") {

        this.pushable[LEFT] = false;
      }
      else {

        this.pushable[LEFT] = true;
      }

      if (Objects.getTileFlag(this.x / tile_w + 1, this.y / tile_h) == "y") {

        this.pushable[RIGHT] = false;
      }
      else {

        this.pushable[RIGHT] = true;
      }
    }

    if (Background.getTile((this.x / tile_w).toFixed(0), (this.y / tile_h).toFixed()) == "05x00n") {

      if (!this.resting_on_goal) {

        // The block is resting on a goal.
        this.resting_on_goal = true;

        Momo.playSound(sound_goal, 1.0, 1.0, false);
      }
    }
    else {

      // The block is not resting on a goal.
      this.resting_on_goal = false;
    }

    if (this.move[UP]) {

      this.moveUp();
    }
    else if (this.move[DOWN]) {

      this.moveDown();
    }
    else if (this.move[LEFT]) {

      this.moveLeft();
    }
    else if (this.move[RIGHT]) {

      this.moveRight();
    }
  }

  render() {

    if (this.resting_on_goal) {

      // Draw the block as blue.
      Momo.drawPartialImage(

        image_tiles,

        tile_w * 7,

        0,

        tile_w,

        tile_h,

        this.x,

        this.y
      );
    }
    else {

      // Draw the block as red.
      Momo.drawPartialImage(

        image_tiles,

        tile_w * 4,

        0,

        tile_w,

        tile_h,

        this.x,

        this.y
      );
    }
  }

  moveUp() {

    if (!this.moving) {

      this.start_tile = this.y / tile_h;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;

      Objects.setTile(this.x / tile_w, this.stop_tile, "00x00y");
      Objects.setTile(this.x / tile_w, this.start_tile, "00x00n");
    }

    if (this.y > this.stop_tile * tile_h) {

      this.y = Smile.getY() - tile_h;
    }
    else {

      this.y = this.stop_tile * tile_h;

      this.moving = false;

      this.move[UP] = false;
    }
  }

  moveDown() {

    if (!this.moving) {

      this.start_tile = this.y / tile_h;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;

      Objects.setTile(this.x / tile_w, this.stop_tile, "00x00y");
      Objects.setTile(this.x / tile_w, this.start_tile, "00x00n");
    }

    if (this.y < this.stop_tile * tile_h) {

      this.y = Smile.getY() + tile_h;
    }
    else {

      this.y = this.stop_tile * tile_h;

      this.moving = false;

      this.move[DOWN] = false;
    }
  }

  moveLeft() {

    if (!this.moving) {

      this.start_tile = this.x / tile_w;
      this.stop_tile = this.start_tile - 1;

      this.moving = true;

      Objects.setTile(this.stop_tile, this.y / tile_h, "00x00y");
      Objects.setTile(this.start_tile, this.y / tile_h, "00x00n");
    }

    if (this.x > this.stop_tile * tile_h) {

      this.x = Smile.getX() - tile_w;
    }
    else {

      this.x = this.stop_tile * tile_w;

      this.moving = false;

      this.move[LEFT] = false;
    }
  }

  moveRight() {

    if (!this.moving) {

      this.start_tile = this.x / tile_w;
      this.stop_tile = this.start_tile + 1;

      this.moving = true;

      Objects.setTile(this.stop_tile, this.y / tile_h, "00x00y");
      Objects.setTile(this.start_tile, this.y / tile_h, "00x00n");
    }

    if (this.x < this.stop_tile * tile_h) {

      this.x = Smile.getX() + tile_w;
    }
    else {

      this.x = this.stop_tile * tile_w;

      this.moving = false;

      this.move[RIGHT] = false;
    }
  }

  getX() {

    return this.x;
  }

  getY() {

    return this.y;
  }

  setX(x) {

    this.x = x;
  }

  setY(y) {

    this.y = y;
  }

  push(direction) {

    this.move[direction] = true;
  }

  isOnGoal() {

    return this.resting_on_goal;
  }

  isPushable(direction) {

    return this.pushable[direction];
  }

  isMoving() {

    return this.moving;
  }
}
