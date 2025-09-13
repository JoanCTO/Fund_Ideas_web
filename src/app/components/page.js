"use client";

import { useState } from "react";
import {
  Layout,
  Container,
  Section,
  Grid,
  Flex,
} from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress, ProgressCircle } from "@/components/ui/Progress";
import { Badge, NotificationBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { Alert, Toast } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Loading/Spinner";
import {
  Skeleton,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/Loading/Skeleton";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import {
  TabGroup,
  TabList,
  TabTrigger,
  TabContent,
  TabPanels,
} from "@/components/ui/Tab";
import { Tooltip } from "@/components/ui/Tooltip";
import { Checkbox, CheckboxGroup } from "@/components/ui/Form/Checkbox";
import { Select } from "@/components/ui/Form/Select";
import { Textarea } from "@/components/ui/Form/Textarea";
import { FileUpload } from "@/components/ui/Form/FileUpload";
import {
  Heart,
  Share2,
  MoreHorizontal,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  ThumbsUp,
  MessageCircle,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function ComponentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedTab, setSelectedTab] = useState("buttons");
  const [checkboxValues, setCheckboxValues] = useState({
    terms: false,
    newsletter: true,
    notifications: false,
  });
  const [selectValue, setSelectValue] = useState("");
  const [files, setFiles] = useState([]);

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
  ];

  const handleCheckboxChange = (name, checked) => {
    setCheckboxValues((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <Layout>
      <Container className="py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-tighter text-zinc-100">
            Component Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-zinc-400">
            Explore our complete design system with glassmorphism aesthetics and
            dark theme foundation
          </p>
        </div>

        {/* Navigation Tabs */}
        <TabGroup
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-12"
        >
          <TabList className="justify-center">
            <TabTrigger value="buttons">Buttons</TabTrigger>
            <TabTrigger value="forms">Forms</TabTrigger>
            <TabTrigger value="cards">Cards</TabTrigger>
            <TabTrigger value="feedback">Feedback</TabTrigger>
            <TabTrigger value="navigation">Navigation</TabTrigger>
            <TabTrigger value="data">Data Display</TabTrigger>
          </TabList>

          <TabPanels>
            {/* Buttons Tab */}
            <TabContent value="buttons">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Button Components
                </h2>

                <div className="space-y-8">
                  {/* Button Variants */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Variants
                    </h3>
                    <Flex gap="lg" wrap>
                      <Button variant="primary">Primary Button</Button>
                      <Button variant="glass">Glass Button</Button>
                      <Button variant="accent">Accent Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                    </Flex>
                  </div>

                  {/* Button Sizes */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Sizes
                    </h3>
                    <Flex gap="lg" align="center">
                      <Button variant="primary" size="sm">
                        Small
                      </Button>
                      <Button variant="primary" size="default">
                        Default
                      </Button>
                      <Button variant="primary" size="lg">
                        Large
                      </Button>
                    </Flex>
                  </div>

                  {/* Button States */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      States
                    </h3>
                    <Flex gap="lg">
                      <Button variant="primary">Normal</Button>
                      <Button variant="primary" disabled>
                        Disabled
                      </Button>
                      <Button variant="primary" fullWidth>
                        Full Width
                      </Button>
                    </Flex>
                  </div>

                  {/* Icon Buttons */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Icon Buttons
                    </h3>
                    <Flex gap="lg">
                      <Button variant="glass" size="sm">
                        <Heart className="mr-2 h-4 w-4" />
                        Like
                      </Button>
                      <Button variant="accent" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Flex>
                  </div>
                </div>
              </Section>
            </TabContent>

            {/* Forms Tab */}
            <TabContent value="forms">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Form Components
                </h2>

                <div className="max-w-2xl space-y-8">
                  {/* Input Fields */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Input Fields
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        helperText="This will be displayed on your profile"
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error="Please enter a valid email address"
                      />
                      <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        success="Password meets all requirements"
                      />
                    </div>
                  </div>

                  {/* Select Dropdown */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Select Dropdown
                    </h3>
                    <Select
                      label="Choose an option"
                      placeholder="Select an option"
                      options={selectOptions}
                      value={selectValue}
                      onChange={setSelectValue}
                      searchable
                    />
                  </div>

                  {/* Checkboxes */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Checkboxes
                    </h3>
                    <CheckboxGroup>
                      <Checkbox
                        label="I agree to the terms and conditions"
                        checked={checkboxValues.terms}
                        onChange={(e) =>
                          handleCheckboxChange("terms", e.target.checked)
                        }
                      />
                      <Checkbox
                        label="Subscribe to newsletter"
                        description="Get updates about new features and projects"
                        checked={checkboxValues.newsletter}
                        onChange={(e) =>
                          handleCheckboxChange("newsletter", e.target.checked)
                        }
                      />
                      <Checkbox
                        label="Enable notifications"
                        checked={checkboxValues.notifications}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "notifications",
                            e.target.checked,
                          )
                        }
                      />
                    </CheckboxGroup>
                  </div>

                  {/* Textarea */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Textarea
                    </h3>
                    <Textarea
                      label="Project Description"
                      placeholder="Describe your project in detail..."
                      helperText="Minimum 100 characters"
                      autoResize
                      minRows={4}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      File Upload
                    </h3>
                    <FileUpload
                      label="Project Files"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      multiple
                      maxFiles={5}
                      maxSize={10 * 1024 * 1024}
                      files={files}
                      onFilesChange={setFiles}
                      helperText="Upload project documentation and images"
                    />
                  </div>
                </div>
              </Section>
            </TabContent>

            {/* Cards Tab */}
            <TabContent value="cards">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Card Components
                </h2>

                <Grid cols={3} gap="lg">
                  {/* Default Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Default Card</CardTitle>
                      <CardDescription>
                        This is a default glass card
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-400">
                        Card content goes here. This demonstrates the glass
                        morphism effect.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Testimonial Card */}
                  <Card variant="testimonial">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <span className="font-medium text-zinc-100">
                            John Doe
                          </span>
                          <span className="text-zinc-400">@johndoe</span>
                        </div>
                        <p className="text-sm leading-snug text-zinc-300">
                          "This platform has revolutionized how we fund
                          technical projects. Amazing experience!"
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Elevated Card */}
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Elevated Card</CardTitle>
                      <CardDescription>
                        With enhanced glass effect
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">
                            Progress
                          </span>
                          <span className="text-sm font-medium text-zinc-100">
                            75%
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="flex space-x-2">
                          <Button variant="accent" size="sm">
                            Action
                          </Button>
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabContent>

            {/* Feedback Tab */}
            <TabContent value="feedback">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Feedback Components
                </h2>

                <div className="space-y-8">
                  {/* Alerts */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Alerts
                    </h3>
                    <div className="space-y-4">
                      <Alert
                        variant="success"
                        title="Success!"
                        description="Your project has been created successfully."
                      />
                      <Alert
                        variant="warning"
                        title="Warning"
                        description="Please review your project details before submitting."
                      />
                      <Alert
                        variant="error"
                        title="Error"
                        description="Something went wrong. Please try again."
                      />
                      <Alert
                        variant="info"
                        title="Information"
                        description="This is an informational message."
                      />
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Progress Indicators
                    </h3>
                    <div className="space-y-4">
                      <Progress value={65} label="Project Funding" showLabel />
                      <Progress
                        value={30}
                        variant="success"
                        label="Milestone Progress"
                        showLabel
                      />
                      <Progress
                        value={85}
                        variant="warning"
                        label="Team Completion"
                        showLabel
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Badges
                    </h3>
                    <Flex gap="lg" wrap>
                      <Badge variant="default">Default</Badge>
                      <Badge variant="violet">Violet</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="error">Error</Badge>
                      <Badge variant="solid">Solid</Badge>
                    </Flex>
                  </div>

                  {/* Loading States */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Loading States
                    </h3>
                    <div className="space-y-4">
                      <Flex gap="lg" align="center">
                        <Spinner size="sm" />
                        <Spinner size="default" />
                        <Spinner size="lg" />
                        <Spinner size="xl" />
                      </Flex>
                      <SkeletonCard />
                    </div>
                  </div>
                </div>
              </Section>
            </TabContent>

            {/* Navigation Tab */}
            <TabContent value="navigation">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Navigation Components
                </h2>

                <div className="space-y-8">
                  {/* Dropdowns */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Dropdowns
                    </h3>
                    <Flex gap="lg">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="glass">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem>Profile</DropdownItem>
                          <DropdownItem>Account</DropdownItem>
                          <DropdownItem>Preferences</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Flex>
                  </div>

                  {/* Tooltips */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Tooltips
                    </h3>
                    <Flex gap="lg">
                      <Tooltip content="This is a tooltip">
                        <Button variant="ghost">Hover me</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip on the right" placement="right">
                        <Button variant="ghost">Right tooltip</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip below" placement="bottom">
                        <Button variant="ghost">Bottom tooltip</Button>
                      </Tooltip>
                    </Flex>
                  </div>
                </div>
              </Section>
            </TabContent>

            {/* Data Display Tab */}
            <TabContent value="data">
              <Section>
                <h2 className="mb-8 text-2xl font-semibold text-zinc-100">
                  Data Display Components
                </h2>

                <div className="space-y-8">
                  {/* Icons */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Icons
                    </h3>
                    <Flex gap="lg" wrap>
                      <Icon variant="default">
                        <Heart className="h-5 w-5" />
                      </Icon>
                      <Icon variant="violet">
                        <Star className="h-5 w-5" />
                      </Icon>
                      <Icon variant="success">
                        <ThumbsUp className="h-5 w-5" />
                      </Icon>
                      <Icon variant="warning">
                        <MessageCircle className="h-5 w-5" />
                      </Icon>
                      <Icon container size="lg" variant="violet">
                        <Settings className="h-6 w-6" />
                      </Icon>
                    </Flex>
                  </div>

                  {/* Notification Badges */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Notification Badges
                    </h3>
                    <Flex gap="lg" align="center">
                      <NotificationBadge count={5} variant="error">
                        <Button variant="ghost">
                          <Bell className="h-5 w-5" />
                        </Button>
                      </NotificationBadge>
                      <NotificationBadge count={12} variant="success">
                        <Button variant="ghost">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                      </NotificationBadge>
                      <NotificationBadge count={99} variant="violet">
                        <Button variant="ghost">
                          <Mail className="h-5 w-5" />
                        </Button>
                      </NotificationBadge>
                    </Flex>
                  </div>

                  {/* Progress Circles */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-zinc-100">
                      Circular Progress
                    </h3>
                    <Flex gap="lg">
                      <ProgressCircle value={75} size={80} showLabel />
                      <ProgressCircle
                        value={50}
                        size={80}
                        variant="success"
                        showLabel
                      />
                      <ProgressCircle
                        value={90}
                        size={80}
                        variant="warning"
                        showLabel
                      />
                    </Flex>
                  </div>
                </div>
              </Section>
            </TabContent>
          </TabPanels>
        </TabGroup>

        {/* Interactive Demo */}
        <Section>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Try out some interactive components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Flex gap="lg">
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    Open Modal
                  </Button>
                  <Button variant="glass" onClick={() => setShowToast(true)}>
                    Show Toast
                  </Button>
                </Flex>

                <div className="text-sm text-zinc-400">
                  Click the buttons above to see modal and toast components in
                  action.
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </Container>

      {/* Modal Demo */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
        description="This is a demonstration of our modal component"
      >
        <ModalContent>
          <p className="mb-4 text-zinc-400">
            This modal showcases the glass morphism design with backdrop blur
            effects.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Toast Demo */}
      {showToast && (
        <Toast
          variant="success"
          title="Toast Notification"
          description="This is a demo toast message"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </Layout>
  );
}
