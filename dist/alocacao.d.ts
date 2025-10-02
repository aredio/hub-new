declare class AssetAllocationCalculator {
    private currentQuestion;
    private answers;
    private chart;
    private suggestedAllocation;
    private currentAllocation;
    private questions;
    private allocationPresets;
    private rationales;
    constructor();
    private initializeEventListeners;
    private loadQuestion;
    private updateNavigationButtons;
    selectOption(optionId: string): void;
    nextQuestion(): void;
    previousQuestion(): void;
    finishQuestionnaire(): void;
    private calculateProfile;
    private showResults;
    private updateProfileInfo;
    private updateAllocationDetails;
    private updateRationale;
    private createAllocationChart;
    private createAllocationSliders;
    updateAllocation(index: number, value: string): void;
    private updateChart;
    private updateTotalValidation;
    resetToSuggested(): void;
    saveAllocation(): void;
    restartQuestionnaire(): void;
    exportResults(): void;
    private generateCSV;
    private downloadFile;
}
export default AssetAllocationCalculator;
//# sourceMappingURL=alocacao.d.ts.map