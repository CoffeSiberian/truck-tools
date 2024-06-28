pub struct VecItemsReplace {
    pub index: usize,
    pub value: String,
    pub to_delete: bool,
}

pub struct VecGaragesReplace {
    pub veicles: Vec<VecItemsReplace>,
    pub drivers: Vec<VecItemsReplace>,
}
