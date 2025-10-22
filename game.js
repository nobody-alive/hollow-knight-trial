// Phaser 3 Hollow Knight Inspired Demo
class BootScene extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){}
  create(){ this.scene.start('Main'); }
}

class Main extends Phaser.Scene {
  constructor(){ super('Main'); }
  create(){
    this.cameras.main.setBackgroundColor('#071025');
    const W = 1600, H = 900;
    this.physics.world.setBounds(0,0,W,H);

    const platforms = [[0,860,1600,80],[200,700,300,24],[700,600,320,24],[1150,500,300,24],[420,420,220,24],[50,300,200,24]];
    this.ground = this.physics.add.staticGroup();
    platforms.forEach(p=>{
      const [x,y,w,h]=p;
      const g=this.add.rectangle(x+w/2,y+h/2,w,h,0x203040).setOrigin(0.5);
      this.ground.add(g);
    });

    this.player=this.physics.add.sprite(120,760,null);
    this.player.body.setSize(28,44);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);
    this.player.speed=260;this.player.jumpSpeed=-450;this.player.canDoubleJump=true;this.player.dashCooldown=0;this.player.isDashing=false;this.player.facing=1;
    this.player.maxHP=6;this.player.hp=this.player.maxHP;this.player.maxSoul=5;this.player.soul=0;

    this.attackHit=this.add.rectangle(0,0,48,24,0xfff8).setVisible(false);
    this.physics.add.existing(this.attackHit);
    this.attackHit.body.setAllowGravity(false);
    this.attackHit.body.setImmovable(true);

    this.enemies=this.physics.add.group();
    this.spawnEnemy(750,560);
    this.spawnEnemy(1250,440);

    this.physics.add.collider(this.player,this.ground,this.onGround,null,this);
    this.physics.add.collider(this.enemies,this.ground);
    this.physics.add.overlap(this.attackHit,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemies,this.playerHit,null,this);

    this.cameras.main.startFollow(this.player,true,0.08,0.08);
    this.cameras.main.setBounds(0,0,W,H);

    this.keys=this.input.keyboard.addKeys({left:'A',right:'D',up:'W',shift:'SHIFT',attack:'J',heal:'K'});
    this.hpText=this.add.text(10,10,'',{font:'16px Arial',fill:'#fff'}).setScrollFactor(0);
    this.soulText=this.add.text(10,30,'',{font:'14px Arial',fill:'#9be6ff'}).setScrollFactor(0);
    this.attacking=false;this.attackTimer=0;this.lastHitTime=0;
  }
  onGround(p,plat){ if(p.body.touching.down) p.canDoubleJump=true; }
  spawnEnemy(x,y){ const e=this.add.rectangle(x,y,36,36,0xaa6666);this.physics.add.existing(e);e.body.setCollideWorldBounds(true);e.body.setBounce(0.2);e.hp=2;e.speed=60;this.enemies.add(e); }
  hitEnemy(hit,enemy){ if(!enemy._damaged){enemy.hp--;enemy._damaged=true;this.time.delayedCall(120,()=>enemy._damaged=false,[],this);if(enemy.hp<=0)enemy.destroy();this.player.soul=Math.min(this.player.maxSoul,this.player.soul+1);}}
  playerHit(p,e){const now=this.time.now;if(now-this.lastHitTime<500)return;this.lastHitTime=now;p.hp--;if(p.hp<=0)this.scene.restart();}
  update(t,dt){
    const k=this.keys,p=this.player,b=p.body,onGround=b.blocked.down||b.touching.down;
    let move=0;if(k.left.isDown)move=-1;if(k.right.isDown)move=1;if(move)p.facing=move;if(!p.isDashing)b.velocity.x=Phaser.Math.Linear(b.velocity.x,move*p.speed,0.3);
    if(Phaser.Input.Keyboard.JustDown(k.up)){if(onGround){b.velocity.y=p.jumpSpeed;p.canDoubleJump=true;}else if(p.canDoubleJump){b.velocity.y=p.jumpSpeed*0.9;p.canDoubleJump=false;}}
    if(Phaser.Input.Keyboard.JustDown(k.shift)&&p.dashCooldown<=0){p.isDashing=true;p.dashCooldown=1.2;const d=p.facing;b.velocity.x=d*700;b.velocity.y=0;this.time.delayedCall(160,()=>p.isDashing=false,[],this);}
    this.enemies.getChildren().forEach(e=>{if(!e.body)return;const dx=p.x-e.x;if(Math.abs(dx)>8)e.body.velocity.x=Math.sign(dx)*e.speed;else e.body.velocity.x=0;});
    if(Phaser.Input.Keyboard.JustDown(k.attack)&&!this.attacking){this.attacking=true;this.attackTimer=180;this.attackHit.setVisible(true);this.attackHit.x=p.x+p.facing*40;this.attackHit.y=p.y;this.attackHit.body.reset(this.attackHit.x,this.attackHit.y);}
    if(this.attacking){this.attackTimer-=dt;this.attackHit.x=p.x+p.facing*40;this.attackHit.y=p.y;this.attackHit.body.reset(this.attackHit.x,this.attackHit.y);if(this.attackTimer<=0){this.attacking=false;this.attackHit.setVisible(false);}}
    if(Phaser.Input.Keyboard.JustDown(k.heal)&&p.soul>=3&&p.hp<p.maxHP){p.soul-=3;p.hp=Math.min(p.maxHP,p.hp+2);}
    this.hpText.setText('HP: '+p.hp+'/'+p.maxHP);this.soulText.setText('SOUL: '+p.soul+'/'+p.maxSoul);
  }
}

const config={type:Phaser.AUTO,width:1000,height:600,parent:'game-container',physics:{default:'arcade',arcade:{gravity:{y:1000},debug:false}},scene:[BootScene,Main]};
window.onload=()=>{new Phaser.Game(config);};
