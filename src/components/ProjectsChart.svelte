<script lang="ts">
    export let techFrequency: { tech: string; count: number }[] = [];
    export let clearFilterText: string = "Clear filter";
    export let noMatchText: string = "No projects match the selected technologies";

    let selectedTechs: string[] = [];

    $: maxCount = techFrequency.length > 0 ? techFrequency[0].count : 1;
    $: hasFilter = selectedTechs.length > 0;

    function toggleTech(tech: string) {
        if (selectedTechs.includes(tech)) {
            selectedTechs = selectedTechs.filter((t) => t !== tech);
        } else {
            selectedTechs = [...selectedTechs, tech];
        }
        dispatchFilter();
    }

    function removeTech(tech: string) {
        selectedTechs = selectedTechs.filter((t) => t !== tech);
        dispatchFilter();
    }

    function clearAll() {
        selectedTechs = [];
        dispatchFilter();
    }

    function dispatchFilter() {
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("tech-filter-change", {
                    detail: [...selectedTechs],
                }),
            );
        }
    }

    function handleKeydown(event: KeyboardEvent, tech: string) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTech(tech);
        }
    }
</script>

<div class="projects-chart">
    <!-- Bar chart -->
    <div class="chart-rows">
        {#each techFrequency as { tech, count }}
            {@const isSelected = selectedTechs.includes(tech)}
            {@const barWidth = (count / maxCount) * 100}
            <div
                class="chart-row"
                class:selected={isSelected}
                class:dimmed={hasFilter && !isSelected}
                role="button"
                tabindex="0"
                on:click={() => toggleTech(tech)}
                on:keydown={(e) => handleKeydown(e, tech)}
                aria-pressed={isSelected}
                aria-label="{tech}: {count}"
            >
                <span class="chart-label">{tech}</span>
                <div class="chart-bar-track">
                    <div
                        class="chart-bar"
                        style="width: {barWidth}%"
                    ></div>
                </div>
                <span class="chart-count">{count}</span>
            </div>
        {/each}
    </div>

    <!-- Active filter pills -->
    {#if hasFilter}
        <div class="filter-controls">
            <div class="filter-pills">
                {#each selectedTechs as tech}
                    <button
                        class="filter-pill"
                        on:click={() => removeTech(tech)}
                        aria-label="Remove {tech} filter"
                    >
                        {tech}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                {/each}
            </div>
            <button class="clear-btn" on:click={clearAll}>
                {clearFilterText}
            </button>
        </div>
    {/if}
</div>

<style>
    .projects-chart {
        width: 100%;
    }

    .chart-rows {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .chart-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition:
            background-color 0.15s ease,
            opacity 0.15s ease;
        user-select: none;
    }

    .chart-row:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    :global(.dark) .chart-row:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .chart-row:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: -2px;
    }

    .chart-row.dimmed {
        opacity: 0.4;
    }

    .chart-row.selected {
        background-color: color-mix(in srgb, var(--primary) 10%, transparent);
        opacity: 1;
    }

    :global(.dark) .chart-row.selected {
        background-color: color-mix(in srgb, var(--primary) 15%, transparent);
    }

    .chart-label {
        width: 100px;
        flex-shrink: 0;
        font-size: 0.8125rem;
        color: rgba(0, 0, 0, 0.7);
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :global(.dark) .chart-label {
        color: rgba(255, 255, 255, 0.7);
    }

    .chart-row.selected .chart-label {
        color: var(--primary);
        font-weight: 600;
    }

    .chart-bar-track {
        flex: 1;
        height: 20px;
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        overflow: hidden;
    }

    :global(.dark) .chart-bar-track {
        background-color: rgba(255, 255, 255, 0.06);
    }

    .chart-bar {
        height: 100%;
        background-color: color-mix(in srgb, var(--primary) 40%, transparent);
        border-radius: 4px;
        transition: width 0.3s ease;
        min-width: 4px;
    }

    .chart-row.selected .chart-bar {
        background-color: var(--primary);
    }

    .chart-row:hover .chart-bar {
        background-color: color-mix(in srgb, var(--primary) 60%, transparent);
    }

    .chart-row.selected:hover .chart-bar {
        background-color: var(--primary);
    }

    .chart-count {
        width: 28px;
        flex-shrink: 0;
        font-size: 0.8125rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.5);
        text-align: left;
        font-variant-numeric: tabular-nums;
    }

    :global(.dark) .chart-count {
        color: rgba(255, 255, 255, 0.5);
    }

    .chart-row.selected .chart-count {
        color: var(--primary);
        font-weight: 700;
    }

    .filter-controls {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    :global(.dark) .filter-controls {
        border-top-color: rgba(255, 255, 255, 0.08);
    }

    .filter-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px;
        font-size: 0.75rem;
        font-weight: 500;
        border-radius: 9999px;
        border: none;
        cursor: pointer;
        background-color: color-mix(in srgb, var(--primary) 15%, transparent);
        color: var(--primary);
        transition:
            background-color 0.15s ease,
            transform 0.1s ease;
    }

    .filter-pill:hover {
        background-color: color-mix(in srgb, var(--primary) 25%, transparent);
    }

    .filter-pill:active {
        transform: scale(0.95);
    }

    .clear-btn {
        margin-left: auto;
        padding: 3px 12px;
        font-size: 0.75rem;
        border-radius: 9999px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: transparent;
        color: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        transition:
            background-color 0.15s ease,
            color 0.15s ease;
    }

    :global(.dark) .clear-btn {
        border-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.6);
    }

    .clear-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.8);
    }

    :global(.dark) .clear-btn:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
    }
</style>
