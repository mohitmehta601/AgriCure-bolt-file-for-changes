
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SoilDataForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fieldName: "",
    cropType: "",
    pH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    moisture: "",
    temperature: "",
    fieldSize: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onSubmit(formData);
      toast({
        title: "Soil Data Analyzed",
        description: "Your fertilizer recommendations are ready!",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Soil Analysis Input</span>
        </CardTitle>
        <CardDescription>
          Enter your soil test results to get personalized fertilizer recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                name="fieldName"
                placeholder="e.g., North Field"
                value={formData.fieldName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fieldSize">Field Size (hectares)</Label>
              <Input
                id="fieldSize"
                name="fieldSize"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={formData.fieldSize}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cropType">Crop Type</Label>
            <Select onValueChange={(value) => handleSelectChange("cropType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="soybeans">Soybeans</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pH">Soil pH</Label>
              <Input
                id="pH"
                name="pH"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g., 6.5"
                value={formData.pH}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
              <Input
                id="nitrogen"
                name="nitrogen"
                type="number"
                placeholder="e.g., 25"
                value={formData.nitrogen}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
              <Input
                id="phosphorus"
                name="phosphorus"
                type="number"
                placeholder="e.g., 15"
                value={formData.phosphorus}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="potassium">Potassium (ppm)</Label>
              <Input
                id="potassium"
                name="potassium"
                type="number"
                placeholder="e.g., 120"
                value={formData.potassium}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="organicMatter">Organic Matter (%)</Label>
              <Input
                id="organicMatter"
                name="organicMatter"
                type="number"
                step="0.1"
                placeholder="e.g., 3.2"
                value={formData.organicMatter}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="moisture">Soil Moisture (%)</Label>
              <Input
                id="moisture"
                name="moisture"
                type="number"
                step="0.1"
                placeholder="e.g., 18.5"
                value={formData.moisture}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="temperature">Soil Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g., 22.5"
              value={formData.temperature}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-grass-600 hover:bg-grass-700"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing Soil Data..." : "Generate Recommendations"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SoilDataForm;
