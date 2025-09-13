"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Form/Textarea";
import { Checkbox } from "@/components/ui/Form/Checkbox";

const TIER_TEMPLATES = [
  {
    title: "Early Bird Special",
    description: "Limited quantity discount for early supporters",
    amount: 25,
    isLimited: true,
    quantityLimit: 50,
  },
  {
    title: "Basic Access",
    description: "Standard product access with core features",
    amount: 50,
    isLimited: false,
  },
  {
    title: "Premium Package",
    description: "Enhanced features and priority support",
    amount: 100,
    isLimited: false,
  },
  {
    title: "Supporter Package",
    description: "Product access plus exclusive extras",
    amount: 200,
    isLimited: false,
  },
  {
    title: "VIP Experience",
    description: "Premium benefits plus recognition",
    amount: 500,
    isLimited: true,
    quantityLimit: 10,
  },
];

const MILESTONE_TEMPLATES = [
  {
    title: "Project Kickoff",
    description: "Initial setup and planning phase",
    percentage: 10,
    duration: 7,
  },
  {
    title: "Core Development",
    description: "Main feature development and implementation",
    percentage: 40,
    duration: 30,
  },
  {
    title: "Testing & Refinement",
    description: "Quality assurance and bug fixes",
    percentage: 30,
    duration: 21,
  },
  {
    title: "Launch Preparation",
    description: "Final preparations and launch readiness",
    percentage: 20,
    duration: 14,
  },
];

export function ProjectRewardsMilestones({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    rewardTiers: data.rewardTiers || [],
    milestones: data.milestones || [],
  });

  const [errors, setErrors] = useState({});
  const [editingTier, setEditingTier] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addRewardTier = (template = null) => {
    const newTier = template
      ? { ...template }
      : {
          title: "",
          description: "",
          amount: 0,
          estimatedDelivery: "",
          isLimited: false,
          quantityLimit: null,
          isDigital: false,
        };

    setEditingTier(newTier);
  };

  const saveRewardTier = () => {
    if (!editingTier) return;

    const tierData = {
      ...editingTier,
      amount: parseInt(editingTier.amount) || 0,
      quantityLimit: editingTier.isLimited
        ? parseInt(editingTier.quantityLimit) || 0
        : null,
    };

    if (editingTier.id !== undefined) {
      // Update existing tier
      const updatedTiers = formData.rewardTiers.map((tier, index) =>
        index === editingTier.id ? tierData : tier,
      );
      handleInputChange("rewardTiers", updatedTiers);
    } else {
      // Add new tier
      handleInputChange("rewardTiers", [...formData.rewardTiers, tierData]);
    }

    setEditingTier(null);
  };

  const removeRewardTier = (index) => {
    const updatedTiers = formData.rewardTiers.filter((_, i) => i !== index);
    handleInputChange("rewardTiers", updatedTiers);
  };

  const addMilestone = (template = null) => {
    const newMilestone = template
      ? { ...template }
      : {
          title: "",
          description: "",
          percentage: 0,
          targetDate: "",
        };

    setEditingMilestone(newMilestone);
  };

  const saveMilestone = () => {
    if (!editingMilestone) return;

    const milestoneData = {
      ...editingMilestone,
      percentage: parseInt(editingMilestone.percentage) || 0,
    };

    if (editingMilestone.id !== undefined) {
      // Update existing milestone
      const updatedMilestones = formData.milestones.map((milestone, index) =>
        index === editingMilestone.id ? milestoneData : milestone,
      );
      handleInputChange("milestones", updatedMilestones);
    } else {
      // Add new milestone
      handleInputChange("milestones", [...formData.milestones, milestoneData]);
    }

    setEditingMilestone(null);
  };

  const removeMilestone = (index) => {
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
    handleInputChange("milestones", updatedMilestones);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rewardTiers.length < 3) {
      newErrors.rewardTiers = "You must create at least 3 reward tiers";
    }

    if (formData.milestones.length < 3) {
      newErrors.milestones = "You must create at least 3 milestones";
    }

    // Check if milestone percentages add up to 100%
    const totalPercentage = formData.milestones.reduce(
      (sum, milestone) => sum + milestone.percentage,
      0,
    );
    if (formData.milestones.length > 0 && totalPercentage !== 100) {
      newErrors.milestones =
        "Milestone percentages must add up to exactly 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-2xl">Rewards & Milestones</CardTitle>
        <p className="text-zinc-400">
          Create reward tiers for backers and define project milestones for fund
          release.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Reward Tiers Section */}
        <div className="animate-element">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-zinc-100">Reward Tiers</h3>
            <Button variant="glass" size="sm" onClick={() => addRewardTier()}>
              Add Tier
            </Button>
          </div>

          {/* Tier Templates */}
          <div className="mb-6">
            <p className="mb-3 text-sm text-zinc-400">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              {TIER_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => addRewardTier(template)}
                  className="glass rounded-xl px-3 py-2 text-sm transition-colors hover:bg-zinc-900/30"
                >
                  {template.title} (${template.amount})
                </button>
              ))}
            </div>
          </div>

          {/* Existing Tiers */}
          <div className="space-y-4">
            {formData.rewardTiers.map((tier, index) => (
              <Card key={index} variant="minimal">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-medium text-zinc-100">
                          ${tier.amount}
                        </h4>
                        <span className="text-zinc-300">{tier.title}</span>
                        {tier.isLimited && (
                          <span className="rounded-lg bg-violet-500/20 px-2 py-1 text-xs text-violet-400">
                            Limited ({tier.quantityLimit})
                          </span>
                        )}
                        {tier.isDigital && (
                          <span className="rounded-lg bg-green-500/20 px-2 py-1 text-xs text-green-400">
                            Digital
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-zinc-400">
                        {tier.description}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Delivery: {tier.estimatedDelivery || "TBD"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTier({ ...tier, id: index })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRewardTier(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {errors.rewardTiers && (
            <p className="mt-2 text-sm text-red-400">{errors.rewardTiers}</p>
          )}
        </div>

        {/* Milestones Section */}
        <div className="animate-element animate-delay-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-zinc-100">
              Project Milestones
            </h3>
            <Button variant="glass" size="sm" onClick={() => addMilestone()}>
              Add Milestone
            </Button>
          </div>

          {/* Milestone Templates */}
          <div className="mb-6">
            <p className="mb-3 text-sm text-zinc-400">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              {MILESTONE_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => addMilestone(template)}
                  className="glass rounded-xl px-3 py-2 text-sm transition-colors hover:bg-zinc-900/30"
                >
                  {template.title} ({template.percentage}%)
                </button>
              ))}
            </div>
          </div>

          {/* Existing Milestones */}
          <div className="space-y-4">
            {formData.milestones.map((milestone, index) => (
              <Card key={index} variant="minimal">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-medium text-zinc-100">
                          {milestone.title}
                        </h4>
                        <span className="rounded-lg bg-violet-500/20 px-2 py-1 text-sm text-violet-400">
                          {milestone.percentage}%
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-zinc-400">
                        {milestone.description}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Target: {milestone.targetDate || "TBD"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingMilestone({ ...milestone, id: index })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Milestone Progress */}
          {formData.milestones.length > 0 && (
            <div className="glass mt-4 rounded-2xl p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-400">Total Progress</span>
                <span className="text-zinc-100">
                  {formData.milestones.reduce(
                    (sum, m) => sum + m.percentage,
                    0,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-violet-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      formData.milestones.reduce(
                        (sum, m) => sum + m.percentage,
                        0,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {errors.milestones && (
            <p className="mt-2 text-sm text-red-400">{errors.milestones}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="animate-element animate-delay-200 flex justify-between pt-6">
          <Button variant="glass" onClick={onPrevious} disabled={isLoading}>
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            size="lg"
            className="min-w-[140px]"
          >
            Continue
          </Button>
        </div>
      </CardContent>

      {/* Tier Edit Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingTier.id !== undefined
                  ? "Edit Reward Tier"
                  : "Add Reward Tier"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tier Title"
                value={editingTier.title}
                onChange={(e) =>
                  setEditingTier({ ...editingTier, title: e.target.value })
                }
                placeholder="e.g., Early Bird Special"
                maxLength={50}
              />

              <Input
                label="Pledge Amount ($)"
                type="number"
                min="10"
                value={editingTier.amount}
                onChange={(e) =>
                  setEditingTier({ ...editingTier, amount: e.target.value })
                }
                placeholder="50"
              />

              <Textarea
                label="Tier Description"
                value={editingTier.description}
                onChange={(e) =>
                  setEditingTier({
                    ...editingTier,
                    description: e.target.value,
                  })
                }
                placeholder="Describe what backers get at this tier"
                rows={3}
                maxLength={500}
              />

              <Input
                label="Estimated Delivery Date"
                type="date"
                value={editingTier.estimatedDelivery}
                onChange={(e) =>
                  setEditingTier({
                    ...editingTier,
                    estimatedDelivery: e.target.value,
                  })
                }
              />

              <div className="space-y-3">
                <Checkbox
                  label="Limited Quantity"
                  checked={editingTier.isLimited}
                  onChange={(checked) =>
                    setEditingTier({ ...editingTier, isLimited: checked })
                  }
                />

                {editingTier.isLimited && (
                  <Input
                    label="Quantity Limit"
                    type="number"
                    min="1"
                    value={editingTier.quantityLimit || ""}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        quantityLimit: e.target.value,
                      })
                    }
                    placeholder="50"
                  />
                )}

                <Checkbox
                  label="Digital Delivery"
                  checked={editingTier.isDigital}
                  onChange={(checked) =>
                    setEditingTier({ ...editingTier, isDigital: checked })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="glass"
                  onClick={() => setEditingTier(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={saveRewardTier} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Milestone Edit Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingMilestone.id !== undefined
                  ? "Edit Milestone"
                  : "Add Milestone"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Milestone Title"
                value={editingMilestone.title}
                onChange={(e) =>
                  setEditingMilestone({
                    ...editingMilestone,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Core Development Complete"
                maxLength={100}
              />

              <Input
                label="Fund Release Percentage"
                type="number"
                min="1"
                max="100"
                value={editingMilestone.percentage}
                onChange={(e) =>
                  setEditingMilestone({
                    ...editingMilestone,
                    percentage: e.target.value,
                  })
                }
                placeholder="25"
              />

              <Textarea
                label="Milestone Description"
                value={editingMilestone.description}
                onChange={(e) =>
                  setEditingMilestone({
                    ...editingMilestone,
                    description: e.target.value,
                  })
                }
                placeholder="Describe what will be completed at this milestone"
                rows={3}
                maxLength={500}
              />

              <Input
                label="Target Date"
                type="date"
                value={editingMilestone.targetDate}
                onChange={(e) =>
                  setEditingMilestone({
                    ...editingMilestone,
                    targetDate: e.target.value,
                  })
                }
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="glass"
                  onClick={() => setEditingMilestone(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={saveMilestone} className="flex-1">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
