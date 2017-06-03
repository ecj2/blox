let tile_w = 32;
let tile_h = 32;

let image_tiles = undefined;

let font_pixel = undefined;

let sound_push = undefined;
let sound_goal = undefined;
let sound_error = undefined;

let Smile = undefined;
let Objects = undefined;
let Background = undefined;

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

const ERASER = 1;
const TILE = 2;
const WALL = 3;
const BLOCK = 4;
const GOAL = 5;
const PLAYER = 6;

const tiles_per_screen_x = 26;
const tiles_per_screen_y = 16;

// This keeps track of moves that affect the placement of blocks and the such.
let moves = 0;

// This just keeps track of the number of moves to display on the HUD.
let moves_counter = 0;

let number_of_blocks = 0;

let Blocks = [];

let edit_mode = false;

let mouse_tile_x = -1;
let mouse_tile_y = -1;

let win = false;

let item = 1;

let item_text = "";

let level = -1;

let last_time = 0;

let time_difference = 0;

function collide(ax, ay, bx, by) {

  return (Math.abs(ax - bx) * 2 < (tile_w * 2) && (Math.abs(ay - by) * 2 < (tile_h * 2)));
}

let undo_player_x = [];
let undo_player_y = [];

let undo_block_x = [];
let undo_block_y = [];

for (let i = 0; i < 999; ++i) {

  undo_block_x[i] = [i];
  undo_block_y[i] = [i];
}
