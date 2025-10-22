# hollow-knight-trial
Here are the controls based on your game.js code:

Movement

A → Move left

D → Move right

W → Jump

Press once to jump normally

Press again in mid-air for a double jump (if available)

Dash

SHIFT → Dash in the direction you’re facing

Cooldown: 1.2 seconds

Dashes quickly across the ground

Combat

J → Attack

Creates a small attack hitbox in front of your player

Damages enemies if they overlap with it

K → Heal

Costs 3 SOUL

Restores 2 HP (cannot exceed max HP)

Stats

HP (Hit Points) → Top-left corner

SOUL → Just below HP

Gain SOUL by damaging enemies

Gameplay Mechanics

The player follows basic physics: gravity, bounce, collisions with platforms.

Enemies move toward the player horizontally.

Getting hit reduces HP. If HP reaches 0, the scene restarts.

Attacking builds SOUL, which you can spend to heal.
