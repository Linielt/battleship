# Battleship

A web implementation of Battleship made for The Odin Project

## Description

A player can select singleplayer or multiplayer mode.

A player can then place ships vertically or horizontally on their board by clicking.
You can rotate, reset or randomize your ship placements with buttons.
A computer will default to their ships being placed randomly

The game ends when all ships have been sunk on any given board.

## Extra Features

- Added a delay when passing the device so players cannot see each other's board
- Intelligent computer player that attacks adjacent spots when it gets a hit

## What to improve

I am working on refactoring a majority of the code as it is heavily reliant on globally scoped variables and I am going to
break down more code into separate classes, functions and files as it is very messy and hard to read.

## Build

```
$ npm install
$ npm run start
```
