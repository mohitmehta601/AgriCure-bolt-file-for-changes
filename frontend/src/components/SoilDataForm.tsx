import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchSoilType, SoilDataResponse } from "@/services/farmService";

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
    fieldSize: "",
    latitude: "",
    longitude: "",
  });
  const [autoSoil, setAutoSoil] = useState<{
    type?: string;
    confidence?: number;
    sources?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) =>
    setFormData((p) => ({ ...p, [name]: value }));

  const detectSoil = async () => {
    try {
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        toast({
          title: "Enter valid coordinates",
          description: "Latitude/Longitude are required",
        });
        return;
      }
      setLocLoading(true);
      const r: SoilDataResponse = await fetchSoilType(lat, lon);
      setAutoSoil({
        type: r.soil_type,
        confidence: r.confidence,
        sources: r.sources,
      });
      toast({
        title: "Soil type detected",
        description: `${r.soil_type} • confidence ${(
          r.confidence * 100
        ).toFixed(0)}%`,
      });
    } catch (err: any) {
      toast({ title: "Soil detection failed", description: err.message });
      setAutoSoil({});
    } finally {
      setLocLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation unavailable" });
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((p) => ({
          ...p,
          latitude: String(latitude),
          longitude: String(longitude),
        }));
        setLocLoading(false);
      },
      (err) => {
        toast({ title: "Location error", description: err.message });
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit({
      ...formData,
      soilTypeAuto: autoSoil.type ?? null,
      soilConfidence: autoSoil.confidence ?? null,
    });
    toast({
      title: "Soil Data Analyzed",
      description: "Your fertilizer recommendations are ready!",
    });
    setIsLoading(false);
  };

  const confidenceLabel =
    autoSoil.confidence == null
      ? ""
      : autoSoil.confidence >= 0.8
      ? "High"
      : autoSoil.confidence >= 0.6
      ? "Medium"
      : "Low";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Soil Analysis Input</span>
        </CardTitle>
        <CardDescription>
          Enter your soil test results. You can auto-detect soil type from
          location.
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
            <Select
              onValueChange={(value) => handleSelectChange("cropType", value)}
            >
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

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                placeholder="e.g., 25.1527"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                placeholder="e.g., 75.8415"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                onClick={useMyLocation}
                variant="secondary"
                disabled={locLoading}
              >
                {locLoading ? "Locating..." : "Use My Location"}
              </Button>
              <Button type="button" onClick={detectSoil} disabled={locLoading}>
                {locLoading ? "Detecting..." : "Get Soil Type"}
              </Button>
            </div>
          </div>

          {/* Auto soil display */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Soil Type (Auto-detected)</Label>
              <div className="mt-2 flex items-center gap-3 rounded-md border p-3">
                <span className="font-medium">{autoSoil.type ?? "—"}</span>
                {autoSoil.confidence != null && (
                  <span className="text-xs rounded px-2 py-0.5 bg-emerald-50 border border-emerald-200">
                    Confidence: {confidenceLabel} (
                    {((autoSoil.confidence || 0) * 100).toFixed(0)}%)
                  </span>
                )}
                {autoSoil.sources?.length ? (
                  <span className="text-xs text-muted-foreground">
                    Sources: {autoSoil.sources.join(", ")}
                  </span>
                ) : null}
              </div>
            </div>
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
