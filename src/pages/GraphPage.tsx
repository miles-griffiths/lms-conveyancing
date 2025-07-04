import React, { useEffect, useRef } from 'react';
import Ogma from '@linkurious/ogma';

const GraphPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !tooltipRef.current) return;

    const ogma = new Ogma({
      container: containerRef.current,
      options: {
        renderer: 'canvas',
      },
    });

    // ✅ Node positions matching your image
    const nodes = [
      { id: 'property', data: { label: 'Property' }, attributes: { x: 100, y: 300 } },
      { id: 'lender', data: { label: 'Lender' }, attributes: { x: 80, y: 500 } },
      { id: 'lms', data: { label: 'LMS' }, attributes: { x: 300, y: 100 } },
      { id: 'phone', data: { label: 'Phone' }, attributes: { x: 500, y: 150 } },
      { id: 'client', data: { label: 'Client' }, attributes: { x: 350, y: 350 } },
    ];

    const edges = [
      { source: 'property', target: 'client' },
      { source: 'property', target: 'lender' },
      { source: 'property', target: 'lms' },
      { source: 'lender', target: 'client' },
      {
        source: 'lms',
        target: 'phone',
        data: { callDateTime: '2025-07-01T09:15:00', duration: '3 min' },
      },
      {
        source: 'lms',
        target: 'phone',
        data: { callDateTime: '2025-07-02T11:30:00', duration: '5 min' },
      },
      {
        source: 'client',
        target: 'phone',
        data: { callDateTime: '2025-06-29T13:00:00', duration: '9 min' },
      },
      {
        source: 'client',
        target: 'phone',
        data: { callDateTime: '2025-07-01T10:55:00', duration: '7 min' },
      },
      {
        source: 'client',
        target: 'phone',
        data: { callDateTime: '2025-07-01T12:45:00', duration: '15 min' },
      },
      {
        source: 'client',
        target: 'phone',
        data: { callDateTime: '2025-07-03T10:45:00', duration: '7 min' },
      },
    ];

    ogma.setGraph({ nodes, edges }).then(() => {
      ogma.styles.addNodeRule(() => true, {
        text: {
          content: (node) => node.getData().label,
        },
        color: '#3399ff',
        radius: 20,
      });

      ogma.styles.addEdgeRule(() => true, {
        color: '#999',
        shape: 'arrow',
        width: 1,
        text: {
          content: (edge) => {
            const data = edge.getData();
            return data?.callDateTime ? `${data.callDateTime} (${data.duration})` : '';
          },
        },
      });

      // ✅ Tooltip on edge click
      ogma.events.onClick((evt: any) => {
        const target = evt.target;
        const type = target?.getType?.();
        const data = target?.getData?.();
        const { x, y } = evt.domEvent;

        console.log(`[CLICK] ${type}:`, target?.getId?.(), data);

        if (type === 'edge' && data?.callDateTime && tooltipRef.current) {
          tooltipRef.current.innerHTML = `<div><strong>${data.callDateTime}</strong><br/>${data.duration}</div>`;
          tooltipRef.current.style.left = `${x + 10}px`;
          tooltipRef.current.style.top = `${y + 10}px`;
          tooltipRef.current.style.display = 'block';
        } else if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      });

      // ✅ Respect manual layout
      ogma.view.locateGraph({ duration: 400 });
    });

    return () => {
      ogma.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          display: 'none',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: '6px 10px',
          borderRadius: '4px',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          fontSize: '13px',
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default GraphPage;
