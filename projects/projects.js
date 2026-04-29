import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
let query = '';
let selectedIndex = -1;

const title = document.querySelector('.projects-title');
title.textContent = `${projects.length} Projects`;

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');
function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  arcData.forEach((d, idx) => {
    svg.append('path')
        .attr('d', arcGenerator(d))
        .attr('fill', colors(idx))
        .attr('class', idx === selectedIndex ? 'selected' : '')
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;

            svg.selectAll('path')
                .attr('class', (_, i) =>
                    i === selectedIndex ? 'selected' : ''
                );

            legend.selectAll('li')
                .attr('class', (_, i) =>
                    i === selectedIndex ? 'selected' : ''
                );

            projectsContainer.innerHTML = '';

            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                let selectedYear = data[selectedIndex].label;

                let filteredProjects = projects.filter(
                p => p.year === selectedYear
            );

    renderProjects(filteredProjects, projectsContainer, 'h2');
  }
        });
});

  data.forEach((d, idx) => {
    legend.append('li')
        .attr('class', idx === selectedIndex ? 'selected' : '')
        .attr('style', `--color:${colors(idx)}`)
        .html(`
            <span class="swatch"></span>
            ${d.label} <em>(${d.value})</em>
        `);
  });
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  projectsContainer.innerHTML = '';
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});