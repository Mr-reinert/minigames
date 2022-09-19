const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background_layer_1.png'
})
const shop = new Sprite({
    position: {
        x: 500,
        y: 110
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
        position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0       
    },
    imageSrc: './img/Sprites/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites:{
        idle: {
            imageSrc: './img/Sprites/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Sprites/Run.png',
            framesMax: 8
        }
    }
})

const enemy = new Fighter({
        position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0       
    },
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },

}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    //enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    
// o movimento maluco do player
    player.image = player.sprites.idle.image
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.image = player.sprites.run.image
    }

// o movimento maluco do inimigo
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //detectar ataque
    if(
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
        }) && 
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        }) && 
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //fim de jogo por vida
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player,enemy,timerId})
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            player.lastKey = 'd'
            keys.d.pressed = true
            break
        case 'a':
            player.lastKey = 'a'
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = - 20
            break
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = - 20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break 
    }
// olha olha inimigo hein hahaha 
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
}
})

