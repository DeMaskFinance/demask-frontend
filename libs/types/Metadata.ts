interface MetadataAttribute {
  trait_type: string;
  value: string;
}

interface Metadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
    animation_url: string;
    attributes: MetadataAttribute[]; 
    category: string[];
  }