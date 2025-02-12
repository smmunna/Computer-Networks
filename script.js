class TopologyVisualizer {
    constructor() {
        this.canvas = document.getElementById('topologyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTopology = 'bus';
        this.nodes = [];
        this.connections = [];
        
        this.topologyData = {
            bus: {
                title: 'Bus Topology',
                advantages: [
                    'Easy to install and extend',
                    'Less cable required',
                    'Cost-effective',
                    'Suitable for small networks'
                ],
                disadvantages: [
                    'Limited cable length',
                    'Performance issues with heavy traffic',
                    'If backbone cable fails, network fails',
                    'Signal interference and attenuation'
                ]
            },
            ring: {
                title: 'Ring Topology',
                advantages: [
                    'Equal access to resources',
                    'Simple to install',
                    'Less cable required',
                    'No central node needed'
                ],
                disadvantages: [
                    'Single point of failure affects network',
                    'Adding/removing devices disrupts network',
                    'Troubleshooting is difficult',
                    'Data travels through each node'
                ]
            },
            star: {
                title: 'Star Topology',
                advantages: [
                    'Easy to install and manage',
                    'Centralized management',
                    'Easy to detect faults',
                    'One device failure doesn\'t affect others'
                ],
                disadvantages: [
                    'Requires more cable',
                    'If central hub fails, network fails',
                    'More expensive',
                    'Performance depends on central hub'
                ]
            },
            // Add more topology data here
        };

        this.initializeEventListeners();
        this.resizeCanvas();
        this.switchTopology('bus');
    }

    initializeEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.querySelectorAll('.topology-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.topology-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchTopology(e.target.dataset.topology);
            });
        });
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    switchTopology(topology) {
        this.currentTopology = topology;
        this.updateInfo();
        this.resetAnimation();
        this.draw();
    }

    updateInfo() {
        const data = this.topologyData[this.currentTopology];
        document.getElementById('topologyTitle').textContent = data.title;
        
        const advantagesList = document.getElementById('advantagesList');
        const disadvantagesList = document.getElementById('disadvantagesList');
        
        advantagesList.innerHTML = data.advantages.map(adv => `<li>${adv}</li>`).join('');
        disadvantagesList.innerHTML = data.disadvantages.map(dis => `<li>${dis}</li>`).join('');
    }

    resetAnimation() {
        this.nodes = [];
        this.connections = [];
        
        switch(this.currentTopology) {
            case 'bus':
                this.setupBusTopology();
                break;
            case 'ring':
                this.setupRingTopology();
                break;
            case 'star':
                this.setupStarTopology();
                break;
            // Add more cases for other topologies
        }
    }

    setupBusTopology() {
        const centerY = this.canvas.height / 2;
        const spacing = this.canvas.width / 6;
        
        // Create nodes
        for(let i = 0; i < 5; i++) {
            this.nodes.push({
                x: spacing + (i * spacing),
                y: centerY - 50,
                radius: 20
            });
        }
        
        // Create backbone
        this.connections.push({
            x1: spacing / 2,
            y1: centerY,
            x2: this.canvas.width - spacing / 2,
            y2: centerY
        });
    }

    setupRingTopology() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
    }

    setupStarTopology() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        // Central node
        this.nodes.push({
            x: centerX,
            y: centerY,
            radius: 25
        });
        
        // Peripheral nodes
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 20
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 3;
        
        if(this.currentTopology === 'bus') {
            this.drawBusConnections();
        } else {
            this.drawConnections();
        }
        
        // Draw nodes
        this.nodes.forEach((node, index) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = index === 0 && this.currentTopology === 'star' ? '#e74c3c' : '#3498db';
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawBusConnections() {
        // Draw backbone
        this.ctx.beginPath();
        this.connections.forEach(conn => {
            this.ctx.moveTo(conn.x1, conn.y1);
            this.ctx.lineTo(conn.x2, conn.y2);
        });
        this.ctx.stroke();
        
        // Draw vertical connections
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y + node.radius);
            this.ctx.lineTo(node.x, this.canvas.height / 2);
            this.ctx.stroke();
        });
    }

    drawConnections() {
        if(this.currentTopology === 'ring') {
            this.ctx.beginPath();
            this.nodes.forEach((node, index) => {
                const nextNode = this.nodes[(index + 1) % this.nodes.length];
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(nextNode.x, nextNode.y);
            });
            this.ctx.stroke();
        } else if(this.currentTopology === 'star') {
            const centerNode = this.nodes[0];
            this.ctx.beginPath();
            for(let i = 1; i < this.nodes.length; i++) {
                this.ctx.moveTo(centerNode.x, centerNode.y);
                this.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
            this.ctx.stroke();
        }
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new TopologyVisualizer();
}); 