import { useEffect, useRef } from "react";

// Katakana + cifre: i caratteri che "piovono" nell'effetto matrix
const DEFAULT_CHARSET =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

// Scompone "#00ff00" nei canali r/g/b; se il formato non è valido ripiega sul verde matrix
function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return { r: 0, g: 255, b: 0 };

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

// Sfondo animato: disegnato su <canvas>, sta dietro al contenuto (vedi .matrix-bg in App.css).
// fontSize regola la densità delle colonne, speed la velocità di caduta.
function MatrixBackground({
  fontSize = 16,
  speed = 1,
  color = "#00ff00",
  charset = DEFAULT_CHARSET,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = charset.split("");
    const rgb = hexToRgb(color);
    const columnWidth = fontSize;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Una colonna = una scia di caratteri che cade con velocità e lunghezza proprie
    function createColumn(x) {
      return {
        x,
        y: Math.random() * -height,
        speed: (0.5 + Math.random() * 0.5) * speed,
        chars: Array.from(
          { length: 25 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ),
        length: 15 + Math.floor(Math.random() * 15),
      };
    }

    let columns = Array.from(
      { length: Math.ceil(width / columnWidth) },
      (_, i) => createColumn(i * columnWidth)
    );

    // Al resize aggiungo o taglio colonne senza ricreare l'animazione da zero
    function handleResize() {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const columnCount = Math.ceil(width / columnWidth);
      while (columns.length < columnCount) {
        columns.push(createColumn(columns.length * columnWidth));
      }
      columns = columns.slice(0, columnCount);
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    let animationId;

    function animate() {
      // Velo nero semitrasparente a ogni frame: è ciò che crea la scia che sfuma
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (const column of columns) {
        column.y += column.speed * fontSize * 0.5;

        for (let i = 0; i < column.length; i++) {
          const charY = column.y - i * fontSize;

          // Salto i caratteri fuori dallo schermo
          if (charY < -fontSize || charY > height + fontSize) continue;

          if (i === 0) {
            // Testa della colonna: quasi bianca e con alone
            ctx.fillStyle = `rgba(${Math.min(255, rgb.r + 150)}, ${Math.min(255, rgb.g + 150)}, ${Math.min(255, rgb.b + 150)}, 1)`;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
          } else {
            // Scia: opacità che cala man mano che ci si allontana dalla testa
            const opacity = Math.max(0, 1 - i / column.length);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.8})`;
            ctx.shadowBlur = 0;
          }

          // Ogni tanto muto un carattere: dà l'effetto di codice che cambia
          if (Math.random() < 0.02) {
            column.chars[i % column.chars.length] =
              chars[Math.floor(Math.random() * chars.length)];
          }

          ctx.fillText(column.chars[i % column.chars.length], column.x, charY);
        }

        ctx.shadowBlur = 0;

        // Colonna uscita dal fondo: la faccio ripartire dall'alto con nuovi parametri
        if (column.y - column.length * fontSize > height) {
          column.y = Math.random() * -height * 0.5;
          column.speed = (0.5 + Math.random() * 0.5) * speed;
          column.length = 15 + Math.floor(Math.random() * 15);
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    // Primo riempimento nero, poi parte il loop
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    animationId = requestAnimationFrame(animate);

    // Fermo animazione e observer allo smontaggio: altrimenti restano attivi a vuoto
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [fontSize, speed, color, charset]);

  return (
    <div ref={containerRef} className="matrix-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="matrix-bg__canvas" />
      {/* Scanline e vignetta: pura decorazione, non intercettano i click */}
      <div className="matrix-bg__scanlines" />
      <div className="matrix-bg__vignette" />
    </div>
  );
}

export default MatrixBackground;
