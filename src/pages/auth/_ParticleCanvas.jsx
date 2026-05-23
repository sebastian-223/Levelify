import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor(init = false) { this.reset(init) }
      reset(init) {
        this.x = Math.random() * canvas.width
        this.y = init ? Math.random() * canvas.height : canvas.height + 10
        this.vx = (Math.random() - 0.5) * 0.35
        this.vy = -(Math.random() * 0.5 + 0.2)
        this.size = Math.random() * 1.5 + 0.4
        this.alpha = Math.random() * 0.55 + 0.1
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        const dx = this.x - mouseRef.current.x
        const dy = this.y - mouseRef.current.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 130) {
          const f = ((130 - d) / 130) * 0.9
          this.vx += (dx / d) * f * 0.05
          this.vy += (dy / d) * f * 0.05
        }
        if (this.y < -10 || this.x < -20 || this.x > canvas.width + 20) this.reset(false)
      }
      draw() {
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = '#a78bfa'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle(true))

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(loop)
    }
    loop()

    const onMouse = e => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
